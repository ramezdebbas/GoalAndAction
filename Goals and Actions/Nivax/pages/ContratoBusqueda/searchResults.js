// Para obtener una introducción a la plantilla Contrato de búsqueda, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232512

// TODO: Agregue la siguiente etiqueta de script al encabezado de la página principal para
// suscribirse a eventos de contrato de búsqueda.
//  
// <script src="/pages/ContratoBusqueda/searchResults.js"></script>
//
// TODO: Edit the manifest to enable use as a search target.  The package 
// manifest could not be automatically updated.  Open the package manifest file
// and ensure that support for activation of searching is enabled.

(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var appModel = Windows.ApplicationModel;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var searchPageURI = "/pages/ContratoBusqueda/searchResults.html";

    ui.Pages.define(searchPageURI, {
        generateFilters: function () {
            this.filters = [];
            this.filters.push({ results: null, text: "All", predicate: function (item) { return true; } });

            Data.groups.forEach(function (group) {
                if (group.key != "0") {
                    this.filters.push({
                        results: null, text: group.title, predicate: function (item) {
                            if (group.key == "1") {             //Todayy
                                var fecha = new Date();

                                var fitem = data.getDate(item.date);
                                return (fitem.getDate() == fecha.getDate() && fitem.getMonth() == fecha.getMonth() && fitem.getFullYear() == fecha.getFullYear());

                            } else if (group.key == "2") {      //Delayed
                                var fecha = new Date();
                                fecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

                                var fechaitem = data.getDate(item.date);
                                return (fechaitem < fecha);

                            } else if (group.key == "3") {      //Month
                                var fecha = new Date();

                                var fechaitem = data.getDate(item.date);
                                return (fechaitem.getMonth() == fecha.getMonth());

                            }
                            else {
                                return ((item.group == group.key));
                            }
                        }
                    });
                }
            }, this);

            // TODO: Replace or remove example filters.
        },

        itemInvoked: function (eventObject) {
            eventObject.detail.itemPromise.then(function (item) {
                // TODO: Navigate to the item that was invoked.
                // nav.navigate("/html/<yourpage>.html", {item: item.data});
                nav.navigate("/html/splitPage.html", { busqueda: item.data });
            });
        },



        // This function populates a WinJS.Binding.List with search results for the
        // provided query.
        searchData: function (queryText) {
            var originalResults;
            // TODO: Perform the appropriate search on your data.
            if (typeof (window.data) !== "undefined") {
                originalResults = data.items.createFiltered(function (item) {
                    var regex = new RegExp(queryText, "gi")
                    return (item.title.match(regex) || item.shortDescription.match(regex) || item.date.match(regex));
                });
            } else {
                originalResults = new WinJS.Binding.List();
            }
            return originalResults;
        },

        // This function filters the search data using the specified filter.
        applyFilter: function (filter, originalResults) {
            if (filter.results == null) {
                filter.results = originalResults.createFiltered(filter.predicate);
            }
            return filter.results;
        },

        // This function responds to a user selecting a new filter. It updates the
        // selection list and the displayed results.
        filterChanged: function (element, filterIndex) {
            var filterBar = element.querySelector(".filterbar");
            utils.removeClass(filterBar.querySelector(".highlight"), "highlight");
            utils.addClass(filterBar.childNodes[filterIndex], "highlight");

            var filterSelect = element.querySelector(".filterselect");
            filterSelect.selectedIndex = filterIndex;

            var listView = element.querySelector(".resultslist").winControl;
            listView.itemDataSource = this.filters[filterIndex].results.dataSource;
        },

        // This function executes each step required to perform a search.
        handleQuery: function (element, eventObject) {
            this.lastSearch = eventObject.queryText;
            WinJS.Namespace.define("search", { markText: this.markText.bind(this) });
            this.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value);
            this.generateFilters();
            var originalResults = this.searchData(eventObject.queryText);
            this.populateFilterBar(element, originalResults);
            this.applyFilter(this.filters[0], originalResults);

            document.body.focus();
        },

        // This function colors the search term. Referenced in /html/search.html
        // as part of the ListView item templates.
        markText: function (source, sourceProperties, dest, destProperties) {
            var text = source[sourceProperties[0]];
            var regex = new RegExp(this.lastSearch, "gi")
            dest[destProperties[0]] = text.replace(regex, "<mark>$&</mark>");
        },

        // This function generates the filter selection list.
        populateFilterBar: function (element, originalResults) {
            var filterBar = element.querySelector(".filterbar");
            filterBar.innerHTML = "";
            for (var filterIndex = 0; filterIndex < this.filters.length; filterIndex++) {
                this.applyFilter(this.filters[filterIndex], originalResults);

                var li = document.createElement("li");
                li.filterIndex = filterIndex;
                li.textContent = this.filters[filterIndex].text + " (" + this.filters[filterIndex].results.length + ")";
                li.onclick = function (eventObject) { this.filterChanged(element, eventObject.target.filterIndex); }.bind(this);
                filterBar.appendChild(li);

                if (filterIndex === 0) {
                    utils.addClass(li, "highlight");
                    var listView = element.querySelector(".resultslist").winControl;
                    listView.itemDataSource = this.filters[filterIndex].results.dataSource;
                }

                var option = document.createElement("option");
                option.value = filterIndex;
                option.textContent = this.filters[filterIndex].text + " (" + this.filters[filterIndex].results.length + ")";
                element.querySelector(".filterselect").appendChild(option);
            }

            element.querySelector(".filterselect").onchange = function (eventObject) { this.filterChanged(element, eventObject.currentTarget.value); }.bind(this);
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".resultslist").winControl;
            ui.setOptions(listView, {
                itemTemplate: element.querySelector(".itemtemplate"),
                oniteminvoked: this.itemInvoked
            });
            this.handleQuery(element, options);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            var modernQuotationMark = "&#148;";

            var listView = element.querySelector(".resultslist").winControl;
            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                listView.layout = new ui.ListLayout();
                element.querySelector(".titlearea .pagetitle").innerHTML = modernQuotationMark + toStaticHTML(this.lastSearch) + modernQuotationMark;
                element.querySelector(".titlearea .pagesubtitle").innerHTML = "";
            } else {
                listView.layout = new ui.GridLayout();
                element.querySelector(".titlearea .pagetitle").innerHTML = "Search";
                element.querySelector(".titlearea .pagesubtitle").innerHTML = "Results for " + modernQuotationMark + toStaticHTML(this.lastSearch) + modernQuotationMark;
            }
        }
    });

    Windows.UI.WebUI.WebUIApplication.onactivated = function (eventObject) {
        if (eventObject.kind === appModel.Activation.ActivationKind.search) {
            ui.processAll();
            nav.navigate(searchPageURI, { queryText: eventObject.queryText });
        }
    };

  //  appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (eventObject) { nav.navigate(searchPageURI, eventObject); };
})();

﻿(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/split/split.html", {

        /// <field type="WinJS.Binding.List" />
        _items: null,
        _group: null,
        _itemSelectionIndex: -1,

        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {

            var appbar = document.querySelector("#appbar").winControl;
            appbar.showOnlyCommands(["home", "addGroup", "addTask", "showCompleted", "showIncompleted"]);


            var listView = element.querySelector(".itemlist").winControl;

            // Almacene la información sobre el grupo y la selección que se mostrará en
            // esta página.
          //  this._group = (options && options.groupKey) ? Data.resolveGroupReference(options.groupKey) : Data.groups.getAt(0);
          //  this._items = Data.getItemsFromGroup(this._group);
          //  this._itemSelectionIndex = (options && "selectedIndex" in options) ? options.selectedIndex : -1;

            if (options && options.busqueda) {
                element.querySelector("header[role=banner] .pagetitle").textContent = "Searched Item";
                var lista = new WinJS.Binding.List();
                lista.push(options.busqueda);
                this._items = lista;
                this._itemSelectionIndex = 0;
            }
            else {
                this._group = (options && options.group) ? options.group : Data.groups.getAt(0);
                this._items = Data.getItemsFromGroup(this._group);
                this._itemSelectionIndex = (options && "selectedIndex" in options) ? options.selectedIndex : -1;
                element.querySelector("header[role=banner] .pagetitle").textContent = this._group.title;
            }


            element.querySelector("header[role=banner] .pagetitle").textContent = this._group.title;

            // Configure el elemento ListView.
            listView.itemDataSource = this._items.dataSource;
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView.onselectionchanged = this._selectionChanged.bind(this);
            listView.layout = new ui.ListLayout();

            this._updateVisibility();
            if (this._isSingleColumn()) {
                if (this._itemSelectionIndex >= 0) {
                    // Para obtener una vista detallada de una sola columna, cargue el artículo.
                    binding.processAll(element.querySelector(".articlesection"), this._items.getAt(this._itemSelectionIndex));
                }
            } else {
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/split/split.html") {
                    // Limpiar la pila de retroceso para controlar que un usuario ajuste esta página, salga
                    // de ella, elimine el ajuste y, a continuación, vuelva a la página.
                    nav.history.backStack.pop();
                }
                // Si esta página tiene un objeto selectionIndex, haga que dicha selección
                // aparezca en el elemento ListView.
                listView.selection.set(Math.max(this._itemSelectionIndex, 0));
            }
        },

        unload: function () {
          //this._items.dispose();
        },

        // Esta función actualiza el diseño de la página como respuesta a los cambios en viewState.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".itemlist").winControl;
            var firstVisible = listView.indexOfFirstVisible;
            this._updateVisibility();

            var handler = function (e) {
                listView.removeEventListener("contentanimating", handler, false);
                e.preventDefault();
            }

            if (this._isSingleColumn()) {
                listView.selection.clear();
                if (this._itemSelectionIndex >= 0) {
                    // Si la aplicación se ha ajustado como vista detallada de una sola columna,
                    // agregue la vista de lista de columna única a la pila de retroceso.
                    nav.history.current.state = {
                        groupKey: this._group.key,
                        selectedIndex: this._itemSelectionIndex
                    };
                    nav.history.backStack.push({
                        location: "/pages/split/split.html",
                        state: { groupKey: this._group.key }
                    });
                    element.querySelector(".articlesection").focus();
                } else {
                    listView.addEventListener("contentanimating", handler, false);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                    listView.forceLayout();
                }
            } else {
                // Si la aplicación se ha desajustado como vista de dos columnas, quite toda instancia de
                // splitPage que se haya agregado a la pila de retroceso.
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/split/split.html") {
                    nav.history.backStack.pop();
                }
                if (viewState !== lastViewState) {
                    listView.addEventListener("contentanimating", handler, false);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                    listView.forceLayout();
                }

                listView.selection.set(this._itemSelectionIndex >= 0 ? this._itemSelectionIndex : Math.max(firstVisible, 0));
            }
        },

        // Esta función comprueba si las columnas de lista y detalles deben mostrarse
        // en páginas independientes en lugar de en paralelo.
        _isSingleColumn: function () {
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            return (viewState === appViewState.snapped || viewState === appViewState.fullScreenPortrait);
        },

        _selectionChanged: function (args) {
            var listView = document.body.querySelector(".itemlist").winControl;
            var details;
            // De forma predeterminada, la selección se limita a un solo elemento.
            listView.selection.getItems().done(function updateDetails(items) {
                if (items.length > 0) {
                    Data.selectedItem = items[0].data;
                    this._itemSelectionIndex = items[0].index;
                    if (this._isSingleColumn()) {
                        // Si está en estado Snapped o Portrait, navegue a una nueva página que contenga los
                        // detalles del elemento seleccionado.
                        nav.navigate("/pages/split/split.html", { groupKey: this._group.key, selectedIndex: this._itemSelectionIndex });
                    } else {
                        // Si está en estado Full o Filled, actualice la columna de detalles con nuevos datos.
                        details = document.querySelector(".articlesection");
                        binding.processAll(details, items[0].data);
                        details.scrollTop = 0;
                    }
                }
            }.bind(this));

            if (Data.selectedItem != "undefined" && Data.selectedItem.id != 0) {
                var div = document.getElementById("divCambios");
                div.style.display = "block";
                document.getElementById("cbcompletado").checked = Data.selectedItem.completed;
            }
        },

        // Esta función alterna la visibilidad de las dos columnas en función del
        // estado de vista y la selección de elemento actuales.
        _updateVisibility: function () {
            var oldPrimary = document.querySelector(".primarycolumn");
            if (oldPrimary) {
                utils.removeClass(oldPrimary, "primarycolumn");
            }
            if (this._isSingleColumn()) {
                if (this._itemSelectionIndex >= 0) {
                    utils.addClass(document.querySelector(".articlesection"), "primarycolumn");
                    document.querySelector(".articlesection").focus();
                } else {
                    utils.addClass(document.querySelector(".itemlistsection"), "primarycolumn");
                    document.querySelector(".itemlist").focus();
                }
            } else {
                document.querySelector(".itemlist").focus();
            }
        }
    });
})();


function guardarCambios() {
    var cbox = document.getElementById("cbcompletado");
    Data.selectedItem.completed = cbox.checked;
    Data.guardar();
    Application.navigateHome();
}
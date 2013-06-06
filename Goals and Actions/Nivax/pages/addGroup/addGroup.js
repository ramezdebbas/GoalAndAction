// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/addGroup/addGroup.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var appbar = document.querySelector("#appbar").winControl;
            appbar.showOnlyCommands(["home"]);
        },

        unload: function () {
            // TODO: Responder a las navegaciones fuera de esta página.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Responder a los cambios en viewState.
        }
    });
})();

function createGroup() {
    var title = document.getElementById("title").value;
    var shortDescription = document.getElementById("shortDescription").value;
    var background = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
    Data.addGroup(title, shortDescription, background);
    Application.navigateHome();
}
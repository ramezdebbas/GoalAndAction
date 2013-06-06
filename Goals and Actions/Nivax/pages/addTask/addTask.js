// Para obtener una introducción a la plantilla Control de página, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/addTask/addTask.html", {
        // Se llama a esta función cuando un usuario navega a esta página. Esta
        // rellena los elementos de la página con los datos de la aplicación.
        ready: function (element, options) {
            // TODO: Inicializar la página aquí.
            var appbar = document.querySelector("#appbar").winControl;
            appbar.showOnlyCommands(["home"]);


            var seleccion = document.getElementById("grupo");
            
            Data.groups.forEach(function (group) {
                if (group.key !== "0" && group.key !== "1" && group.key !== "2" && group.key !== "3") {
                    if (group.key === "4") {
                        seleccion.add(  new Option(group.title, group.key, true, true));
                    } else {
                        seleccion.add(new Option(group.title, group.key));
                    }
                }
            });
            
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


function createTask() {
    var title = document.getElementById("title").value;
    var shortDescription = document.getElementById("shortDescription").value;
    var description = document.getElementById("description").value;
    var stringFecha = document.getElementById("date").value;
    stringFecha = stringFecha.split("/");
    var errorFecha = false;
    if (stringFecha.length == 3) {
        var dt = new Date(stringFecha[2], stringFecha[1] - 1, stringFecha[0]);

        if (dt.getDate() == stringFecha[0] && dt.getMonth() + 1 == stringFecha[1] && dt.getFullYear() == stringFecha[2]) {
            var group = document.getElementById("grupo").value;
            Data.addTask(title, group, shortDescription, description, dt);
            Application.navigateHome();
        } else {
            errorFecha = true;
        }
    } else {
        errorFecha = true;
    }
    if (errorFecha) {
        document.getElementById("errorFecha").innerHTML = "Bad Format, DD/MM/YYYY";
    }
}
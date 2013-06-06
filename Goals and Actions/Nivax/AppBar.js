(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("default.html", {
        ready: function (element, options) {

            document.getElementById("addGroup")
                .addEventListener("click", Application.navigateAddGroup, false);

            document.getElementById("addTask")
                .addEventListener("click", Application.navigateAddTask, false);

            document.getElementById("showCompleted")
                .addEventListener("click", Data.completas, false);

            document.getElementById("showIncompleted")
                .addEventListener("click", Data.incompletas, false);

            document.getElementById("home")
                .addEventListener("click", Application.navigateHome, false);

         /*   WinJS.log && WinJS.log("To show the bar, swipe up from " +
                "the bottom of the screen, right-click, or " +
                "press Windows Logo + z. To dismiss the bar, " +
                "tap in the application, swipe, right-click, " +
                "or press Windows Logo + z again.", "sample", "status");*/
        },
    });

    function navigateAddGroup() {
        WinJS.log && WinJS.log("AddGroup");
    }

    function navigateAddTask() {
        WinJS.log && WinJS.log("ass task");
    }

    function completas() {
        WinJS.log && WinJS.log(" completas ");
    }

    function incompletas() {
        WinJS.log && WinJS.log("Imcompletas");
    }

    function navigateHome() {
        WinJS.log && WinJS.log("Home");
    }


    WinJS.log = function (message) {
        var statusDiv = document.getElementById("statusMessage");
        if (statusDiv) {
            statusDiv.innerText = message;
        }
    };
})();


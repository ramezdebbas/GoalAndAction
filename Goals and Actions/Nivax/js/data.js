(function () {
    "use strict";

    var itemDescription = "lorem ipsum balbalbla bal bal blab al balb la bal blabla bla bla bla bla lb alb alb la bla blalba lb alb al bal ";
    var shortDescription = "lorem ipsum balbalbla bal bal blab al balb la bal blabla bla bla bla bla lb alb alb la bla blalba lb alb al bal ";
    // These three strings encode placeholder images. You will want to set the
    // backgroundImage property in your real data to be URLs to images.

    var folder = Windows.Storage.ApplicationData.current.localFolder;
    var filegroups = "gruops.txt";
    var filetask = "task.txt";

    // Default gruops
    var defaultGroups = [
        { key: "0", title: "All Goals", shortDescription: "All the to-do's you have", backgroundImage: "images/all.png", description: "" },
        { key: "1", title: "Today's Goals", shortDescription: "Task you want do today", backgroundImage: "images/today.png", description: "" },
        { key: "2", title: "Delayed Goals", shortDescription: "You have to do them!!!", backgroundImage: "images/delayed.png", description: "" },
        { key: "3", title: "Month Goals", shortDescription: "All the task of the month", backgroundImage: "images/month.png", description: "" },
        { key: "4", title: "Personal Goals", shortDescription: "Task of type personal", backgroundImage: "images/personal.png", description: "" },
    ];

    // Examples
    var sampleItems = [
/*
        { group: "4", title: "Task 1", shortDescription: "Item Subtitle: 1", description: itemDescription, date: "3/5/2012" },
        { group: "4", title: "Task 2", shortDescription: "Item Subtitle: 2", description: itemDescription, date: "5/5/2012" },
        { group: "4", title: "Task 3", shortDescription: "Item Subtitle: 3", description: itemDescription, date: "6/5/2012" },
        { group: "4", title: "Task 4", shortDescription: "Item Subtitle: 4", description: itemDescription, date: "12/5/2012" },
        { group: "4", title: "Task 5", shortDescription: "Item Subtitle: 1", description: itemDescription, date: "3/5/2012" },
        { group: "4", title: "Task 6", shortDescription: "Item Subtitle: 2", description: itemDescription, date: "5/5/2012" },
        { group: "4", title: "Task 7", shortDescription: "Item Subtitle: 3", description: itemDescription, date: "6/5/2012" },
        { group: "4", title: "Task 8", shortDescription: "Item Subtitle: 4", description: itemDescription, date: "12/5/2012" },
        { group: "4", title: "Task 9", shortDescription: "Item Subtitle: 1", description: itemDescription, date: "3/5/2012" },
        { group: "4", title: "Task 10", shortDescription: "Item Subtitle: 2", description: itemDescription, date: "5/5/2012" },
        { group: "4", title: "Task 11", shortDescription: "Item Subtitle: 3", description: itemDescription, date: "6/5/2012" },
        { group: "4", title: "Task 12", shortDescription: "Item Subtitle: 4", description: itemDescription, date: "12/5/2012" },
*/
    ];

    var itemExample =
        { id: 0, title: "This Group is Empty", shortDescription: "Add new task for this group", description: "You can add, task easily from the App Bar, and don't forget you can choose the group of the task and create your own groups", date: "..." }
    ;

    var lastId = 1;

    function groupKeySelector(item) {
        return item.group;
    }

    function groupDataSelector(item) {
        var result;
        defaultGroups.forEach(function (gruop) {
            if (gruop.key === item.group)
                result = gruop;
        });

        return result;
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        var result;
        if (group.key == "1") {             //Todayy
            var fecha = new Date();
            result = list.createFiltered(function (item) {
                var fitem = getDate(item.date);
                return (fitem.getDate() == fecha.getDate() && fitem.getMonth() == fecha.getMonth() && fitem.getFullYear() == fecha.getFullYear() && verCompletas == item.completed);
            });
        } else if (group.key == "2") {      //Delayed
            var fecha = new Date();
            fecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            result = list.createFiltered(function (item) {
                var fechaitem = getDate(item.date);
                return (fechaitem < fecha && verCompletas == item.completed);
            });
        } else if (group.key == "3") {      //Month
            var fecha = new Date();
            result = list.createFiltered(function (item) {
                var fechaitem = getDate(item.date);
                return (fechaitem.getMonth() == fecha.getMonth() && verCompletas == item.completed);
            });
        } else {
            result = list.createFiltered(function (item) {
                return ((item.group == group.key || group.key == "0") && verCompletas == item.completed);
            });
        }

        if (result.length == 0) {
            result = new WinJS.Binding.List();
            result.push(itemExample);
        }

        return result;
    }

    var listExample = new WinJS.Binding.List();
    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(groupKeySelector, groupDataSelector);
    var Groups = new WinJS.Binding.List();


    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    /*    sampleItems.forEach(function (item) {
            list.push(item);
        });
    */



    //Lee la información de los ficheros.... Tareas

    folder.getFileAsync(filetask)
    .then(function (file) {
        return Windows.Storage.FileIO.readTextAsync(file);
    }).done(function (respuesta) {
        if (respuesta != "") {
            JSON.parse(respuesta).forEach(function (item) {
                list.push(item);
                if (item.id >= lastId)
                    lastId = item.id + 1;
            });
        }
    }, function () {
        //Error, no se ha creado todavia el fichero
    });

    //Grupos

    folder.getFileAsync(filegroups)
    .then(function (file) {
        return Windows.Storage.FileIO.readTextAsync(file);
    }).done(function (respuesta) {
        if (respuesta != "") {
            JSON.parse(respuesta).forEach(function (item) {
                Groups.push(item);
            });
        } else {
            defaultGroups.forEach(function (item) {
                Groups.push(item);
            });
        }

    }, function () {
        defaultGroups.forEach(function (item) {
            Groups.push(item);
        });
    });



    function addGroup(title, shortDescription, background) {
        var maxgruop = 0;
        Groups.forEach(function (group) {
            if (parseInt(group.key) > maxgruop)
                maxgruop = parseInt(group.key);
        });
        maxgruop++;
        var key = new String(maxgruop);
        var newGroup = { key: key, title: title, shortDescription: shortDescription, backgroundImage: background, description: "" };
        Groups.push(newGroup);
        guardar();
    }

    function addTask(title, gruop, shortDescription, description, fecha) {
        var fs = new String(fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear());
        var newtask = { id: lastId, group: gruop, title: title, shortDescription: shortDescription, description: description, date: fs, completed: false };
        lastId = lastId + 1;
        list.push(newtask);
        guardar();
    }

    function isDateCorrect(fecha) {
        fecha = fecha.split("/");
        if (fecha.length == 3) {
            var f = new Date(fecha[2], fecha[1] - 1, fecha[0]);
            if (f.getDate() == fecha[0] && f.getMonth() + 1 == fecha[1] && f.getFullYear() == fecha[2])
                return true;
            else
                return false;
        } else {
            return false;
        }
    }

    function getDate(fecha) {
        fecha = fecha.split("/");
        var f = new Date(fecha[2], fecha[1] - 1, fecha[0]);
        return f;
    }

    var item = "";

    function deleteitem() {
        //Mirar como hacerlo...
    }

    function guardar() {
        folder.createFileAsync(filegroups, Windows.Storage.CreationCollisionOption.replaceExisting)
           .then(function (file) {
               var toSave = "[";
               var first = true;
               Groups.forEach(function (item) {
                   if (first) { toSave += JSON.stringify(item); first = false; }
                   else toSave += "," + JSON.stringify(item);
               });
               toSave += "]";
               Windows.Storage.FileIO.writeTextAsync(file, toSave);
           });

        folder.createFileAsync(filetask, Windows.Storage.CreationCollisionOption.replaceExisting)
        .then(function (file) {
            var toSave = "[";
            var first = true;
            list.forEach(function (item) {
                if (first) { toSave += JSON.stringify(item); first = false; }
                else toSave += "," + JSON.stringify(item);
            });
            toSave += "]";
            Windows.Storage.FileIO.writeTextAsync(file, toSave);
        });
    }

    var verCompletas = false;

    function mostrarCompletas() {
        verCompletas = true;
        Application.navigateHome();
    }

    function mostrarIncompletas() {
        verCompletas = false;
        Application.navigateHome();
    }

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: Groups,
        getItemsFromGroup: getItemsFromGroup,
        addGroup: addGroup,
        addTask: addTask,
        selectedItem: item,
        guardar: guardar,
        completas: mostrarCompletas,
        incompletas: mostrarIncompletas,
        getDate: getDate
    });
})();

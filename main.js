var classBlock = (function () {
    function classBlock(name) {
        this.name = name;
    }
    classBlock.prototype.print = function () {
        var classOut = "Class : " + this.name;
        return classOut;
    };
    classBlock.prototype.getName = function () {
        return this.name;
    };
    classBlock.prototype.setName = function (name) {
        this.name = name;
        return true;
    };
    return classBlock;
}());
var userClasses = new Map();
$(function () {
    $("#log").val("UML Terminal\n>help");
    $("#command").focus();
    $("#button").click(function () {
        var name = prompt("Please enter class name", "Class");
        var className = $('[name="' + name + '"]').attr('name');
        if (className != undefined) {
            alert("Please enter a unique class name");
            return;
        }
        if (name) {
            $("#blockArea").append("<div class= \"classblock\" name =" + name + "> <form> <select class =\"dropdown\" name =" + name +
                " onchange=\"dropDownClick(this.name, this.value);this.value = 'Select an option...';\"> <option value =\"delete \" selected>Delete class</option> <option value = \"attribute \" selected>Add attribute</option> <option value = \"child \" selected>Add child <option value = \"function \" selected>Add function</option><option value=\"Select an option...\" selected>Select an option... </select> </form>" + name + "</div>");
        }
    });
    $("#edit").click(function () {
        var name = prompt("Please enter class name of the class you would like to edit", "Class");
        var className = $('[name="' + name + '"]');
        if (className.attr('name') == undefined) {
            alert("Cannot edit nonexistent class");
            return;
        }
        console.log(className.attr('name'));
    });
    $(document).ready(function () {
        var $dragging = null;
        $('#blockArea').on("mousedown", "div", function (e) {
            console.log("clicked block");
            $(this).attr('unselectable', 'on').addClass('draggable');
            $('.classblock li, .classblock form').removeAttr('unselectable').removeClass('draggable');
            var el_w = $('.draggable').outerWidth(), el_h = $('.draggable').outerHeight();
            $('#blockArea').on("mousemove", function (e) {
                if ($dragging) {
                    $dragging.offset({
                        top: e.pageY - el_h / 2,
                        left: e.pageX - el_w / 2
                    });
                }
            });
            $dragging = $(e.target);
        }).on("mouseup", ".draggable", function (e) {
            $dragging = null;
            $(this).removeAttr('unselectable').removeClass('draggable');
        });
    });
    $("#inputFile").on("change", function () { loadFile(); });
    $("#command").on('keypress', function (e) {
        if (e.which === 13) {
            var command = $("#command");
            doCommand(command.val());
            command.val("");
        }
    });
});
function dropDownClick(className, option) {
    if (option == "Select an option...") {
    }
    if (option === "function ") {
        console.log(option);
        var input = prompt("Please enter the " + option + "to add");
        if (input) {
            $('[name="' + className + '"]').append("<li>" + input + "()</li>");
        }
    }
    else if (option === "child ") {
        var connectParent = prompt("Please enter the name of the parent to connect to");
        var className_1 = $('[name="' + connectParent + '"]').attr('name');
        if (className_1 == undefined) {
            alert("Class name currently does not exist");
            return;
        }
        else if (className_1 == null) {
            return;
        }
        else {
        }
    }
    else if (option === "delete ") {
        if (confirm("Are you sure you want to delete this class?")) {
            $('[name="' + className + '"]').remove();
        }
        else {
            return;
        }
    }
    else if (option === "attribute ") {
        var input = prompt("Please enter the " + option + "to add");
        if (input) {
            $('[name="' + className + '"]').append("<li>" + input + "</li>");
        }
    }
}
function help(cmd) {
    switch (cmd) {
        case "clear":
            return ">clear\n"
                + " Clears terminal log";
            break;
        case "help":
            return ">help <command>\n"
                + " Is helpful";
            break;
        case "create":
            return ">create <classname>\n"
                + " Creates a block";
            break;
        case "delete":
            return ">delete <classname>\n"
                + " Deletes target class";
            break;
        case "print":
            return ">print <targetclass>\n"
                + " Prints information on target class";
            break;
        case "printall":
            return ">printall\n"
                + " Prints all current classes and their information";
            break;
        case "rename":
            return ">rename <targetclass> <newname>\n"
                + " Changes a classes name";
            break;
        case "save":
            return ">save\n"
                + " Prompts user to save diagram as .yml file";
            break;
        case "load":
            return ">load\n"
                + " Loads diagram from loaded .yml file";
            break;
        case "loadfile":
            return ">loadfile\n"
                + " Reveals a button that prompts for a file";
            break;
        default:
            return cmd + " is not a command";
    }
}
function doCommand(command) {
    var log = $("#log");
    apdLog(">" + command, log);
    var args = (command.split(/\s{1,}/));
    args[0] = args[0].toLocaleLowerCase();
    switch (args[0]) {
        case "clear":
            log.val("");
            break;
        case "help":
            if (args.length > 1) {
                apdLog(help(args[1]), log);
            }
            else {
                apdLog(("list of commands\n"
                    + ">clear\n"
                    + ">create\n"
                    + ">delete\n"
                    + ">rename\n"
                    + ">print\n"
                    + ">printall\n"
                    + ">save\n"
                    + ">load\n"
                    + "type >help <command> for instructions on that command"), log);
            }
            break;
        case "create":
            if (userClasses.has(args[1])) {
                apdLog("Name already in use. Please enter unique name.", log);
            }
            else if (args.length < 2 || args[1] == "") {
                apdLog("Please enter a name after create, type <help> <create> for more info", log);
            }
            else {
                userClasses.set(args[1], new classBlock(args[1]));
                apdLog(userClasses.get(args[1]).getName() + " created", log);
            }
            break;
        case "delete":
            if (userClasses.has(args[1])) {
                userClasses.delete(args[1]);
                apdLog(args[1] + " deleted", log);
            }
            else {
                apdLog(args[1] + " class does not exist", log);
            }
            break;
        case "print":
            if (userClasses.has(args[1])) {
                apdLog(userClasses.get(args[1]).print(), log);
            }
            else {
                apdLog(args[1] + " class does not exist", log);
            }
            break;
        case "printall":
            userClasses.forEach(function (block) {
                apdLog(block.print(), log);
            });
            break;
        case "rename":
            if (args.length != 3) {
                apdLog("Please use this format: >rename <targetclass> <newname>", log);
                break;
            }
            else if (!userClasses.has(args[1])) {
                apdLog(args[1] + " does not exist", log);
                break;
            }
            apdLog(rename(args[1], args[2]), log);
            break;
        case "save":
            saveFile();
            break;
        case "load":
            selectFile();
            break;
        default:
            apdLog(args[0] + " is not a command", log);
            break;
    }
    log.scrollTop(log[0].scrollHeight);
}
function rename(oldName, newName) {
    if (userClasses.has(newName)) {
        return "Please enter a unique class name";
    }
    else {
        userClasses.get(oldName).setName(newName);
        userClasses.set(newName, userClasses.get(oldName));
        userClasses.delete(oldName);
        return ("Changed the name of class " + oldName + " to " + newName);
    }
}
function loadFile() {
    var inputFile = $("#inputFile");
    var file = inputFile.prop('files')[0];
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFile = fileLoadedEvent.target.result;
        userClasses.clear();
    };
    fileReader.readAsText(file, "UTF-8");
}
function selectFile() {
    $("#inputFile").click();
}
function saveFile() {
    document.getElementById("link").click();
}
function apdLog(newText, log) {
    log.val(log.val() + "\n" + newText);
}
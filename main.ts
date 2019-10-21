/// <reference path="classBlock.ts" />

let userClasses = new Map<string, classBlock>();

$(function() {
	//vars
	let log : JQuery = $("#log");
	let command : JQuery = $("#command");

	//do on page load
	log.val("UML Terminal\n>help");
	command.focus();

	//do on event

	//Button left hand side
	$("#add").click(function(){

		//get name from user and then check if the div exists	
		let name = prompt("Please enter class name", "Class");
		let className = $('[name="' + name + '"]').attr('name');

		//if the name is found, className won't be undefined, so we know the 
		//class name already exists
		if (className != undefined) {
			alert("Please enter a unique class name");
			return;
		} 

		//check if the name is null
		if (name) {
		$("#blockArea").append("<div class= \"classblock\" name =" + name + "> <form> <select class =\"dropdown\" draggable = \"false\" name =" + name + 
			" onchange=\"dropDownClick(this.name, this.value);this.value = 'Select an option...';\"> <option value =\"delete \" selected>Delete class</option> <option value = \"attribute \" selected>Add attribute</option> <option value = \"child \" selected>Add child <option value = \"function \" selected>Add function</option><option value=\"Select an option...\" selected>Select an option... </select> </form>" + name +  "</div>");
		}

	});

	//controls editing the class blocks
	$("#edit").click(function() {
		let name = prompt("Please enter the name of the class you would like to edit", "Class");
		let className = $('[name="' + name + '"]');

		if(name == null) {
			return;
		} else if(className.attr('name') == undefined) {
			alert("Cannot edit nonexistent class");
			return;
		}

		let option = prompt("Would you like to delete or edit an existing attribute or function? type 'delete' or 'edit' without quotes");
		//handles deleting attributes
		if(option.toLowerCase().trim() == "delete"){
			let item = prompt("What is the name of the attribute/function you'd like to delete? ");
			item = item.toLowerCase().trim();

			$('[name="' + name + '"]').children().each(function() {
				console.log("hi");
				if($(this).text() === item) {
					console.log("Inside if")
					$(this).remove();
				}
			});
			
		//handles editing attributes/functions
		} else if (option.toLowerCase().trim() == "edit"){
			let itemToEdit = prompt("What is the name of the attribute/function you'd like to edit? ");
			let newName = prompt("What would you like to rename it too? ");
			itemToEdit = itemToEdit.toLowerCase().trim();
			
			$('[name="' + name + '"]').children().each(function() {
				if($(this).text() === itemToEdit) {
					$(this).text(newName);
				}
			});

		}
	});

	$("#save").click(function() {
		
	});



	//dragging
	$(document).ready(function() {
    var $dragging = null;
    $('#blockArea').on("mousedown", "div", function(e) {
		console.log("clicked block");
		$(this).attr('unselectable', 'on').addClass('draggable');
        var el_w = $('.draggable').outerWidth(),
			el_h = $('.draggable').outerHeight();
			
        $('#blockArea').on("mousemove", function(e) {
            if ($dragging) {
                $dragging.offset({
                    top: e.pageY - el_h / 2,
                    left: e.pageX - el_w / 2
                });
            }
        });
        $dragging = $(e.target);
    }).on("mouseup", ".draggable", function(e) {
		$dragging = null;
        $(this).removeAttr('unselectable').removeClass('draggable');
	});
	
	
});​ 


	
	

	/** Listens to inputFile and loads a file selected from windows prompt
	 * Basically a way to seperate selecting a file from actually loading it
	**/
	$("#inputFile").on("change", function () {loadFile();});

	//runs every time a key is pressed when #command is in focus
	command.on('keypress', function(e) {
		//checks if enter key is pressed
		if(e.which === 13) {
			if (command.val() == "clear")
				log.val("");
			else if (command.val() == "")
				apdLog("", log);
			else {
				apdLog(">" + command.val(), log);
				apdLog (<string>doCommand(<string>command.val())[0], log);
				log.scrollTop(log[0].scrollHeight);
				command.val("");
			}
		}
	});
});

//called functions


function dropDownClick(className, option){

	if (option == "Select an option...")
	{
		//Do NOTHING
	}

	if (option === "function ") {
		console.log(option);
		let input = prompt("Please enter the " + option + "to add")

		//basically, checks for the div with that name and then appends to it. It will always append to the
		//correct div because the name is tied to each div uniquely.
		if (input) {
			$('[name="' + className + '"]').append("<li>" + input + "()</li>");
		}
		
	} else if (option === "child ") {
		//same idea as adding a class block to see if it already exists
		let connectParent = prompt("Please enter the name of the parent to connect to");
		let className = $('[name="' + connectParent + '"]').attr('name');
		
		//prevents connecting to an undefined/null classblock
		//Connects parents and children
		if (className == undefined) {
			alert("Class name currently does not exist");
			return;
		} else if (className == null) {
			return;
		} else {
			//TODO
			//Run code to connect arrows, relationship
		}

	} else if (option === "delete ") {
		//find div based on name and remove
		if(confirm("Are you sure you want to delete this class?")){
			$('[name="' + className + '"]').remove();
		}
		else {
			return;
		}
		
	} else if (option === "attribute ") {
		let input = prompt("Please enter the " + option + "to add")
		if (input) {
			$('[name="' + className + '"]').append("<li>" + input + "</li>");
		}
		
	}
}


/** help (string)
 * is called when user gives an arguement to the help command
 * returns a string explaining specified command to the user
**/

function help(cmd : string) {
	switch (cmd){
		case "clear":
			return ">clear\n"
			+ " Clears terminal log";

		case "help":
			return ">help <command>\n"
			+ " Is helpful";

		case "create":
			return ">create <classname>\n"
			 + " Creates a block";

		case "addvar":
			return ">addvar <targetclass> <var>\n"
			 + " Adds a variable to target class";

		case "delvar":
			return ">delvar <targetclass> <var>\n"
			 + " Deletes a variable from target class";

		case "addfun":
			return ">addvar <targetclass> <var>\n"
			+ " Adds a function to target class";

		case "delfun":
			return ">create <classname>\n"
			+ " Deletes a function from target class";

		case "delete":
			return ">delete <classname>\n"
			 + " Deletes target class";

		case "print":
			return ">print <targetclass>\n"
			+ " Prints information on target class";

		case "printall":
			return ">printall\n"
			+ " Prints all current classes and their information";

		case "rename":
			return ">rename <targetclass> <newname>\n"
			+ " Changes a classes name";

		case "save":
			return ">save\n"
			 + " Prompts user to save diagram as .yml file";

		case "load":
			return ">load\n"
			 + " Loads diagram from loaded .yml file";

		case "loadfile":
			return ">loadfile\n"
			 + " Reveals a button that prompts for a file";

		default:
			return cmd + " is not a command"
	}
}

/** doCommand (string) returns tuple of [string, bool]
 * checks user input for command and executes it if it exists
 * otherwise only returns users input
**/
function doCommand(command : string) {

	//reg expression for split to allow any number of spaces
	let args : Array<string> = (command.split(/\s{1,}/));
	args[0] = args[0].toLocaleLowerCase();

	switch (args[0]) {

		case "help":
			if (args.length > 1) {
				return [help(args[1]), true];
			} else {
				return["list of commands\n"
						+ ">clear\n"
						+ ">create\n"
						+ ">addvar\n"
						+ ">delvar\n"
						+ ">addfun\n"
						+ ">delfun\n"
						+ ">delete\n"
						+ ">rename\n"
						+ ">print\n"
						+ ">printall\n"
						+ ">save\n"
						+ ">load\n"
						+ "type >help <command> for instructions on that command", true];
			}

		case "create":
			if (userClasses.has(args[1])) {
				return ["Name already in use. Please enter unique name.", false];
			} else if (args.length < 2 || args[1] == "") {
				return ["Please enter a name after create, type <help> <create> for more info", false];
			} else {
				userClasses.set(args[1], new classBlock(args[1]));
				return [userClasses.get(args[1]).getName() + " created", true];
			}

		case "delete":
			if (userClasses.has(args[1])) {
				userClasses.delete(args[1]);
				return [args[1] + " deleted", true];
			} else {
				return [args[1] + " class does not exist", false];
			}

		case "addvar":
			if (userClasses.has(args[1])) {
				if (userClasses.get(args[1]).setVar(args[2])) {
					return ["Var " + args[2] + " added to " + args[1], true];
				} else {
					return ["Var " + args[2] + " already exists in " + args[1], false];
				}
			} else {
				return [args[1] + " class does not exist", false];
			}

		case "delvar":
			if (userClasses.has(args[1])) {
				if (userClasses.get(args[1]).removeVar(args[2])) {
					return ["Var " + args[2] + " deleted from " + args[1], true];
				} else {
					return ["Var " + args[2] + " does not exist in " + args[1], false];
				}
			} else {
				return [args[1] + " class does not exist", false];
			}

		case "addfun":
			if (userClasses.has(args[1])) {
				if (userClasses.get(args[1]).setFun(args[2])) {
					return ["Fun " + args[2] + " added to " + args[1], true];
				} else {
					return ["Fun " + args[2] + " already exists in " + args[1], false];
				}
			} else {
				return [args[1] + " class does not exist", false];
			}

		case "delfun":
			if (userClasses.has(args[1])) {
				if (userClasses.get(args[1]).removeFun(args[2])) {
					return ["Fun " + args[2] + " deleted from " + args[1], true];
				} else {
					return ["Fun " + args[2] + " does not exist in " + args[1], false];
				}
			} else {
				return [args[1] + " class does not exist", false];
			}

		case "print":
			if (userClasses.has(args[1])) {
				return [userClasses.get(args[1]).print(), true];
			} else {
				return [args[1] + " class does not exist", false];
			}

		case "printall":
			let newLines : number = userClasses.size;
			let blocks : string = "";
			userClasses.forEach((block : classBlock) => {
				blocks += block.print();
				if (newLines > 1) {
					blocks += "\n";
					--newLines;
				}
			});
			return [blocks, true];

		case "rename":
			if (args.length != 3) {
				return ["Please use this format: >rename <targetclass> <newname>", false];
			} else if (!userClasses.has(args[1])) {
				return [args[1] + " does not exist", false];
			}
			return [rename(args[1], args[2]), true];


		case "save":
			saveFile();
			return ["Saving", true];

		case "load":
			selectFile();
			return ["Loading", true]

		case "addparent":
			if (args.length != 3) {
				return ["format: >addparent <targetclass> <parentclass>", false];
			} else if (!userClasses.has(args[1])) {
				return [args[1] + " does not exist", false];
			} else if (!userClasses.has(args[2])) {
				return [args[2] + " does not exist", false];
			}
			return [addParent(args[1], args[2]), true];
		
		case "getparent": 
			if (args.length != 2) {
				return ["format: >getparent <targetclass>", false];
			} else if (!userClasses.has(args[1])) {
				return [args[1] + " does not exist", false];
			}
			return [getParent(args[1]), true];

		case "removeparent":
			if (args.length != 2) {
				return ["format: >removeparent <targetclass>", false];
			} else if (!userClasses.has(args[1])) {
				return [args[1] + " does not exist", false];
			}
			return [removeParent(args[1]), true];

		case "addchild":
			if (args.length < 3) {
				return ["format: >addchild <targetclass> <childclass>", false];
			} else if (!userClasses.has(args[1])) {
				return [args[1] + " does not exist", false];
			} else if (!userClasses.has(args[2])) {
				return [args[2] + " does not exist", false];
			}
			return [addChild(args[1], args[2]), true];

		case "getchildren":
			if (args.length != 2) {
				return ["format: >getchildren <targetclass>", false];
			} else if (!userClasses.has(args[1])) {
				return [args[1] + " does not exist", false];
			}
			return [getChildren(args[1]), true];

		case "deletechild":
			if (args.length != 3) {
				return ["format: >getchildren <targetclass>", false];
			} else if (!userClasses.has(args[1])) {
				return [args[1] + " does not exist", false];
			} else if (!userClasses.has(args[2])) {
				return [args[2] + " does not exist", false];
			}
			return [deleteChild(args[1], args[2]), true];

		default:
			return [args[0] + " is not a command", false];
	}
}

/**
 * Returns the array of children for a specific class block.
 * @param targetClass 
 */
function getChildren(targetClass : string)
{
	var array = userClasses.get(targetClass).getChildren();
	if(array.length <= 0) {
		return ("This class has no children");
	}
	return ("children: " + array);
}

/**
 * Adds a child class to a specific class block.
 * @param targetClass 
 * @param childClass 
 */
function addChild(targetClass : string, childClass : string)
{
	userClasses.get(targetClass).addChild(childClass);
	userClasses.get(childClass).setParent(targetClass);
	return ("added " + childClass + " as a child to " + targetClass + ".");
}

/**
 * Allows you to remove a child from a parents children array.
 * @param targetClass 
 * @param childClass 
 */
function deleteChild(targetClass : string, childClass : string)
{
	userClasses.get(targetClass).removeChild(childClass);
	return ("Removed " + childClass + " from the children's array of " + targetClass + ".");
}

/**
 * Returns the parent of a specific class block.
 * @param targetClass 
 */
function getParent(targetClass : string)
{
	if(userClasses.get(targetClass).getParent() == null) {
		return ("There is no parent class for " + targetClass + ".");
	}
	return ("The parent of " + targetClass + " is " + userClasses.get(targetClass).getParent() + ".");
}

/**
 * Adds a parent to a specific class block.
 * @param targetClass 
 * @param parentClass 
 */
function addParent(targetClass : string, parentClass : string)
{
	userClasses.get(targetClass).setParent(parentClass);
	userClasses.get(parentClass).addChild(targetClass);
	return ("Added " + parentClass + " as the parent for " + targetClass);
}

/**
 * Removes the current parent of the targetClass.
 * @param targetClass 
 */
function removeParent(targetClass : string)
{
	userClasses.get(targetClass).removeParent();
	return ("Removed the parent of " + targetClass + ".");
}
/** rename (string, string) returns string
 * Renames a class
**/
function rename (oldName : string, newName : string) {
	if(userClasses.has(newName)) {
		return "Please enter a unique class name";
	} else {
		userClasses.get(oldName).setName(newName);
		userClasses.set(newName, userClasses.get(oldName));
		userClasses.delete(oldName);
		return ("Changed the name of class " + oldName + " to " + newName);
	}
}

/**
 * Loads and writes the text contents
 * 		of a file into the html textarea.
 */
function loadFile() {

	// Grabs the file selected from the file input button.
	//var File = (<HTMLInputElement>document.getElementById("inputFile")).files[0];

	let inputFile = $("#inputFile");

	var file : File = inputFile.prop('files')[0];

	// Using a FileReader to read the contents of the file as regular text.
	var fileReader : FileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		var textFromFile = fileLoadedEvent.target.result;
		userClasses.clear();
		let yaml : Array<classBlock> = jsyaml.safeLoad(<string>textFromFile);
		for (let i : number = 0; i < yaml.length; i++) {
			userClasses.set(yaml[i][0], new classBlock(yaml[i][1]["name"]));
			yaml[i][1]["vars"].forEach(function(j) {
				userClasses.get(yaml[i][0]).setVar(j);
			});
			yaml[i][1]["funs"].forEach(function(j) {
				userClasses.get(yaml[i][0]).setFun(j);
			});
			userClasses.get(yaml[i][0]).setParent(yaml[i][1]["parent"]);
			yaml[i][1]["children"].forEach(function(j) {
				userClasses.get(yaml[i][0]).addChild(j);
			});
		}
	}
	fileReader.readAsText(file, "UTF-8");

}

function selectFile() {
	$("#inputFile").click();
}

/**
 * Saves the text from the textarea into a new YAML file.
 */
function saveFile() {
	//var textContent = (<HTMLInputElement>document.getElementById("text")).value;
	//let diagramYaml : string = jsyaml.safeDump (Array.from(userClasses));

	// The octet-stream indicates a binary file.
	// The URI encoder will encode the UTF-8 text.
	//var uriContent = "data:application/octet-stream," + encodeURIComponent(diagramYaml);
	
	// Creates a clickable link to either open or save the file that was just create.
	//document.getElementById("link").outerHTML = "<a id=\"link\" href=" + uriContent + " download=\"diagram.yml\" class=\"hidden\">click me</a>";
	document.getElementById("link").click();
}

/** apdLog (string, JQuery textfield)
 * Appends a string to the consoles log on a new line
**/
function apdLog(newText : string, log : JQuery){
	log.val(log.val() + "\n" + newText);
}

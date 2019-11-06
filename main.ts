/// <reference path="classBlock.ts" />

let userClasses = new Map<string, classBlock>();
let command : JQuery = $("#command");


$(function() {
	//vars
	let log : JQuery = $("#log");
	let command : JQuery = $("#command");

	//do on page load
	log.val("UML Terminal\n>help");
	command.focus();

	//do on event

	

	function addBlock(name, load: boolean = false) {
        let className : string = $('[name="' + name + '"]').attr('name');

        //if the name is found, className won't be undefined, so we know the
        //class name already exists
        if (className != undefined) {
            alert("Please enter a unique class name");
            return;
        }

        //same code below but needed to bypass doCommand check when loading file 
        //(other wise create will return false on load)
        if (load == true) {
            $("#blockArea").append("<div class= \"classblock\" id=" + name + " name =" + name + "> " + name + "</div>");
        }

        //check if the name is null, and if doCommand successfully inserted the name into the userClasses map
        //The appended html adds the visual class block element to the #blockArea.
        if (name && doCommand("create " + name)[1]) {
			$("#blockArea").append("<div class= \"classblock\" id=" + name + " name =" + name + "> " + "<strong>" + name + "</strong>"+  "</div>");
			$("#" + name).append("<div class= \"variables\" > " + "<i> Variables </i>" + "</div");
			$("#"+ name).append("<div class= \"functions\"> " + "<i> Functions </i>" + "</div");
        }
    }

    //click event for adding a class block
	$("#add").click(function(){
		//get name from user and then check if the div exists
        let name : string = prompt("Please enter class name", "Class");
        addBlock(name);
	});


	//controls editing the class blocks
	$("#edit").click(function() {
		let name = prompt("Please enter the name of the class you would like to edit", "Class");
		let className = $('[name="' + name + '"]');

		//check for editing a class that doesn't exist
		if(name == null) {
			return;
		} else if(className.attr('name') == undefined) {
			alert("Cannot edit nonexistent class");
			return;
		}

		let option : string = prompt("Would you like to delete or edit an existing variable or function? type 'delete' or 'edit' without quotes");

		//case for deleteing variables and functions
		if(option.toLowerCase().trim() == "delete") {
			let delOption = prompt("would you like to delete a function or an variable? Type 'variable' or 'function' without quotes");
			delOption = delOption.toLowerCase().trim();

			//deleting a variable
			if (delOption == 'variable') {
				let delAttr : string = prompt("What is the name of the variable you'd like to delete? ");
				delAttr = delAttr.toLowerCase().trim();

				/*for each loop on all child elements within the classBlock. If the text in the <li> is the same as 
					deLAttr, the html <li> element is removed
					checks the <li> tag up to but not including the first [. Then removes the html element if it's not found
					also needs to pass doCommand*/

				$('[name="' + name + '"] .variables').children().each(function() {
					if($(this).text().substr(0, $(this).text().indexOf('[')) === delAttr 
						&& doCommand("delvar " + name + " " + delAttr)[1]) {
						$(this).remove();
					}
				});

			//same idea for function
			//FOR PARAMETERS: probably need to just check til the first (, then delete it if thats found
			} else if (delOption == "function"){
				let delFun : string = prompt("What is the name of the function you'd like to delete?");
				delFun = delFun.toLowerCase().trim();
				//need a string for () to find in gui, and then normal for doCommand

				//finds the correct li with the correct function
				

				$('[name="' + name + '"] .functions').children().each(function() {
					//need to parse the string correctly, remove the return type, and then the parameters to check
					let deleteText : string = $(this).text();
					let newString : string  = deleteText.substr(deleteText.indexOf(" ") + 1, deleteText.length);
					let check : string = newString.substr(0, newString.indexOf("("));
					check = check.trim();
					//check is just the function name with nothing else, so just check if it matches the user input delFun
					if(check === delFun 
						&& doCommand("delfun " + name + " " + delFun)[1]) {
						$(this).remove();
					}
				});
			}
		
			
		//handles editing variables/functions
		} else if (option.toLowerCase().trim() == "edit"){
			let editOption = prompt("would you like to edit a function or an variable? Type 'variable' or 'function' without quotes");

			if (editOption == "variable") {
				let itemToEdit : string = prompt("What is the name of the variable you'd like to edit? ");
				let newName : string = prompt("What would you like to rename it to? (Put 'yes' after the new name if you'd like to edit the type as well)");

				//if(newName.substring(new))

				itemToEdit = itemToEdit.toLowerCase().trim();
				
				//find the correct variable, use indexOf ot get string without the type at the end. Check if it equals user input
				$('[name="' + name + '"] .variables').children().each(function() {
					if($(this).text().substr(0, $(this).text().indexOf('[')) === itemToEdit && doCommand("rename" + " " + name + " " + newName)[1]) {
						let type : string = $(this).text().substring($(this).text().indexOf('['), $(this).text().length);
						$(this).html(newName + "<strong>" + type + "</strong>");
					}
				});

			} else if (editOption == "function"){
				let itemToEdit = prompt("What is the name of the function you'd like to edit?");
				let newName = prompt("What would you like to rename it to? (Don't include parentheses)");
				

				itemToEdit = itemToEdit.toLowerCase().trim();



				$('[name="' + name + '"] .functions').children().each(function() {
					let editFunction : Array<string> = $(this).text().split(" ");

					if(editFunction[1] === itemToEdit && doCommand("rename" + " " + name + " " + newName)[1]) {
						editFunction[1] = newName;
						$(this).html("<li><i>" + editFunction[0] + "</i> " + editFunction[1] + " <strong>" + editFunction[2] + "</strong> </li>");
					}
				});
			}
		}
		
	});


	//save button in GUI calls backend for saving file
	$("#save").click(function() {
		doCommand("save");
	});

	//loads UML diagram into backend and GUI from an already saved yaml file
	$("#load").click(function() {
        doCommand("load");
	});






	/*
	 * Adds a function to the class block. Optional parameters are used only for loading
	 */
	function addFunction(name : string, input?: string, load: boolean = false){
		let className = $('[name="' + name + '"]').attr('name');

		//used only if loading to bypass prompt and doCommand check
		if (load == true) {
			$('[name="' + className + '"]').append("<li>" + input + "()</li>");
			return;
		}

		if (className != undefined){
			let input : string = prompt("Please enter the function you'd like to add to " + name);
			let parameters : string = prompt("Please enter the parameters separated by a comma (no spaces between them");
			let returnType : string = prompt("What is the return type?");

			let inputSplit : Array<string> = input.split(" ");

			//basically, checks for the div with that name and then appends to it. It will always append to the
			//correct div because the name is tied to each div uniquely.
			inputSplit.forEach(function(fun) {
			if (fun && doCommand("addfun " + className + " " + fun)[1]) {
				$('[name="' + className + '"] .functions').append("<li><i>" + returnType + "</i> " + fun + " (<strong>" + parameters + "</strong>) </li>");
			}
		});

		} else {
			alert("Cannot add functions to a class that doesn't exist");
		}
	}

	$("#functionButton").click(function() {
		let name = prompt("Please enter the name of the class you'd like to add a function to", "Class");
		if (name == null) {
			return;
		}
		addFunction(name);
	});





	/*
	 * Adds a variable to the class block both in the GUI and backend representation. Has optional parameters
	 * for loading explained below
	 */
	function addVariable(name : string, input?: string, load: boolean = false) {
		let className : string = $('[name="' + name + '"]').attr('name');

		//uses optional parameters to bypass both the user input prompt with the input?: parameter, and doCommand check
		//with the load parameter
		if(load == true) {
			$('[name="' + className + '"]').append("<li>" + input + "</li>");
			return;
		}

		if (className != undefined){
			let input : string = prompt("Please enter the variables you would like to add to " + name);
			let type : string = prompt("What is the type of this variable?");
			
			/*let inputSplit : Array<string> = input.split(" ");
			inputSplit.forEach(function(variable) {
				
			});*/


			//basically, checks for the div with that name and then appends to it. It will always append to the
			//correct div because the name is tied to each div uniquely.
			//add each of the elements based on the split user input

			if (input && type && doCommand("addvar " + className + " " + input)[1]) {
				//this setup lets us find the exact div to add based on the HTML 'name' tag.
				$('[name="' + className + '"] .variables').append("<li>" +  input +  "<strong>[" + type + "]</strong>" + "</li>");
			} else {
				alert("Please enter a valid variable name/type")
			}


		} else {
			alert("Cannot add variable. Class \"" + name + "\" doesn't exist");
		}
	}

	$("#variableButton").click(function() {

		let name = prompt("Please enter the name of the class you'd like to add a variable to");
		if(name == null || name == undefined) {
			return;
		} else {
			addVariable(name);
		}
		
		
	});





	//used click event for addChild in GUI, also can be called by backend
	function addChild(name : string) {
		let parentDiv = $('[name="' + name + '"]');
		
		//prevents connecting to an undefined/null classblock
		//Connects parents and children
		if (parentDiv != undefined){
			let childName = prompt("Please enter the name of the new child block");

			if (childName == undefined || childName == null) {
				alert("Please enter a valid child name");
				return;
			} else {
				//create a block with that name and draw a line to it
				$("#add").click();
				//code to draw line
				let childDiv =$('[name="' + childName + '"]');

				//jsplumb code goes here, use childDiv and parentDiv to draw line to each other
			}
		} else {
			alert("Cannot add a child to a class that doesn't exist");
		}
	}

	//click function for child. uses a prompt in the GUI
	$("#child").click(function() {
		let name = prompt("Please enter the name of the class you'd like to add a child to", "Class");
		addChild(name);
		
	});





	//deletes class both in the GUI and backend
	function deleteClass(name : string){
		let classToDelete = $('[name="' + name + '"]');

		//find div based on name and remove the entire classblock, including all child elements
		if (userClasses.get(name)){
			if(confirm("Are you sure you want to delete this class?") && doCommand("delete " + name)[1]){
				$('[name="' + name + '"]').remove();
			}
		} else {
			alert("Class \"" + name + "\" does not exist, please enter a valid class name");
		}
	}

	//calls deleteClass() when GUI button is clicked
	$("#delete").click(function() {
		let name = prompt("Please enter the name of the class you'd like to delete");
		deleteClass(name);
		
	});





	//function for dragging
	$(document).ready(function() {
    var $dragging = null;
    $('#blockArea').on("mousedown", "div", function(e) {
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
    	if($dragging.position().left <= 0 || $(this).position().top <= 0) {
    		$dragging.offset({
    			top: 10,
    			left:75
    		});
	    }

		$dragging = null;
        $(this).removeAttr('unselectable').removeClass('draggable');
	});
	
	
});​ 




	
	//need to sleep while user selects file
	const sleep = (milliseconds) => {
 		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	/** Listens to inputFile and loads a file selected from windows prompt
	 * Basically a way to seperate selecting a file from actually loading it
	 * also does loading in the GUI. needs to be put here due to synching issues 
	**/
	$("#inputFile").on("change", function () {
		loadFile();

		//does the actual loading in the GUI
		if($("#blockArea") != undefined) {
			//clear block area for loading
			$("#blockArea").html("");

			sleep(500).then(() => {
				//turn the userClasses map into an array and iterate through it
				for (let key of Array.from(userClasses.keys())) {

            	    addBlock(key, true);

            	    //get variables and functions into arrays based on the key value in the map
	                let variables = userClasses.get(key).getVars();
    	            let functions = userClasses.get(key).getFun();
    				
    				//loop through each array and add them to the corresponding classblock
        	        variables.forEach(function (value) {
            	    	addVariable(key, value, true);
                	});

                	functions.forEach(function (value) {
               	    	addFunction(key, value, true);
               	 	});
            	}
            });
		}
	});


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
		break;
		
		case "removeparent":
			return ">removeparent\n"
			 + " Removes the parent of a classblock." 
		break;
			
		case "addparent":
			return ">addparent\n"
			 + " Adds a parent to a classblock."
		break;
			
		case "getparent":
			return ">getparent\n"
			 + " Returns the parent of a classblock."
		break;
			
		case "deletechild":
			return ">deletechild\n"
			 + " Removes a specific child from a classblock."
		break;
			
		case "getchildren":
			return ">getchildren\n"
			 + " Returns all of the children for a classblock."
		break;
			
		case "addchild":
			return ">addchild\n"
			 + " Adds a child to a classblock."
		break;

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
	if((userClasses.get(targetClass).getChildren()).indexOf(childClass) > -1) {
		userClasses.get(targetClass).removeChild(childClass);
		return ("Removed " + childClass + " from the children's array of " + targetClass + ".");
	}
	return (childClass + " is not a child of " + targetClass + ".");
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
	let diagramYaml : string = jsyaml.safeDump (Array.from(userClasses));

	// The octet-stream indicates a binary file.
	// The URI encoder will encode the UTF-8 text.
	var uriContent = "data:application/octet-stream," + encodeURIComponent(diagramYaml);
	
	// Creates a clickable link to either open or save the file that was just create.
	document.getElementById("link").outerHTML = "<a id=\"link\" href=" + uriContent + " download=\"diagram.yml\" class=\"hidden\">click me</a>";
	document.getElementById("link").click();
}

/** apdLog (string, JQuery textfield)
 * Appends a string to the consoles log on a new line
**/
function apdLog(newText : string, log : JQuery){
	log.val(log.val() + "\n" + newText);
}

import { backEnd } from './backEnd'
//import * as jsPlumb from '../node_modules/jsplumb/index.d'
//import * as jsPlumb from '../dist/jsplumb.min'

let back = new backEnd();
let command : JQuery = $("#command");


$(function() {
	//vars
	let log : JQuery = $("#log");
	let command : JQuery = $("#command");
	let jsPlumb = require("../dist/jsplumb.min.js").jsPlumb;

	//do on page load
	log.val("UML Terminal\n>help");
	command.focus();

	//do on event
	function addBlock(name : string, load: boolean = false) {
		//check for whitespace in name
		if (name.indexOf(" ") > 0) {
			alert("Please enter Class name without spaces");
			return;
		}

        let className : string = $('[name="' + name + '"]').attr('name');

        //if the name is found, className won't be undefined, so we know the
        //class name already exists
        if (className != undefined) {
            alert("Please enter a unique class name");
            return;
        }

        name = name.replace(/<\/?[^>]+(>|$)/g, "");

        //same code below but needed to bypass doCommand check when loading file 
        //(other wise create will return false on load)
        if (load == true) {
          $("#blockArea").append("<div class= \"classblock\" id=" + name + " name =" + name + "> <strong>" + name + "</strong>"+  "</div>");

			$("#" + name).append("<div class= \"variables\" > " + "<i> Variables </i>" + "</div>");
			$("#"+ name).append("<div class= \"functions\"> " + "<i> Functions </i>" + "</div>");
        }

        //check if the name is null, and if doCommand successfully inserted the name into the userClasses map
        //The appended html adds the visual class block element to the #blockArea.
        if (name && back.doCommand("create " + name)[1]) {
			$("#blockArea").append("<div class= \"classblock\" id=" + name + " name =" + name + "> " + "<strong>" + name + "</strong>"+  "</div>");
			$("#" + name).append("<div class= \"variables\" > " + "<i> Variables </i>" + "<input type =\"button\" class = \"editVar\" value = \"+ \" </button>" + "</div>");
			$("#"+ name).append("<div class= \"functions\"> " + "<i> Functions </i>" + "<input type =\"button\" class = \"editFun\" value = \"+ \" </button>" + "</div>");
        }
    }

    //click event for adding a class block
	$("#add").click(function(){
		//get name from user and then check if the div exists
        let name : string = prompt("Please enter class name", "Class");
        addBlock(name);
	});

	/*
	* This function deletes info inside of the classblocks
	*It is used for deleting functions and variables
	*/
	$("#deleteClassInfo").click(function() {
		let name = prompt("Please enter the name of the class you would like to delete functions/variables from", "Class");
		let className = $('[name="' + name + '"]');
		let delOption = prompt("would you like to delete a function or an variable? Type 'variable' or 'function' without quotes");
		delOption = delOption.toLowerCase().trim();

		//If the user wants to delete a variable
		if (delOption == 'variable') {
			let delVar : string = prompt("What is the name of the variable you'd like to delete? ");
			delVar = delVar.toLowerCase().trim();

			/*
			for each loop on all child elements within the classBlock. If the text in the <li> is the same as 
			deLAttr, the html <li> element is removed
			checks the <li> tag up to but not including the first [. Then removes the html element if it's not found
			also needs to pass doCommand
			*/
			$('[name="' + name + '"] .variables').children().each(function() {
				let editVariable : Array<string> = $(this).text().split("]");
				console.log(editVariable[0]);
				console.log(editVariable[1]);
				if(editVariable[1] === delVar
					&& back.doCommand("delvar " + name + " " + delVar)[1]) {
					$(this).remove();
				}
			});

		//If the user wants to delete a function
		} else if (delOption == "function"){

			
			//Get the name of function that the user wants to delete
			let delFun : string = prompt("What is the name of the function you'd like to delete?");
			delFun = delFun.toLowerCase().trim();

			//Finds the object inside of the correct classblock using 'name' and .functions
			$('[name="' + name + '"] .functions').children().each(function() {
				//need to parse the string correctly, remove the return type, and then the parameters to check
				console.log("did a thing");
				let deleteText : string = $(this).text();
				let newString : string  = deleteText.substr(deleteText.indexOf(" ") + 1, deleteText.length);
				let check : string = newString.substr(0, newString.indexOf("("));
				console.log(check);

				//check is just the function name with nothing else, so just check if it matches the user input delFun
				if(check.toLowerCase().trim() === delFun 
					&& back.doCommand("delfun " + name + " " + check)[1]) {
					$(this).remove();
				}
			});
		}
	});

	//controls editing the class blocks
	//handles editing variables/functions
	$("#editClassInfo").click(function() {
		let name = prompt("Please enter the name of the class you would like to edit", "Class");
		let className = $('[name="' + name + '"]');

		//Won't let the user edit a class that doesn't exist
		if(name == null) {
			return;
		} else if(className.attr('name') == undefined) {
			alert("Cannot edit nonexistent class");
			return;
		}
		
		//Picks which if statement to jump too based off which option the user enters
		let editOption = prompt("would you like to edit a function or an variable? Type 'variable' or 'function' without quotes");
		
		//Handles editing variables
		if (editOption == "variable") {
			let itemToEdit : string = prompt ("What is the name of the variable you want to edit?")
			let whatToEdit : string = prompt("Would you like to edit the name, the type or both? (Please enter 'name' or 'type'");

			//If the user wants to edit the name of the variable
			if(whatToEdit == "name"){
				let newName : string = prompt("What would you like to rename it to?");
				$('[name="' + name + '"] .variables').children().each(function() {

					//Splits the variable and variable type into two separate strings
					let editVariable : Array<string> = $(this).text().split("]");
					if(editVariable[1] == itemToEdit) {
						editVariable[1] = newName;
						console.log(editVariable[0]);
						console.log(editVariable[1]);

						//Updates the page to display the new variable name
						$(this).html("<strong>" + editVariable[0] + "]</strong>" + newName);
					}
				});

			//If the user wants to edit the type of the variable
			} else if(whatToEdit == "type"){

				//Gets name of the variable the user wants to edit
				let newType = prompt("What is the new type of this variable?")
				$('[name="' + name + '"] .variables').children().each(function() {
					//Splits the variable and variable type into two separate strings
					let editVariable : Array<string> = $(this).text().split("]");
					if(editVariable[1] == itemToEdit) {

						//Updates page to display new variable type
						$(this).html("<strong>[" + newType +  "]</strong>" + editVariable[1]);
					}
				});

			}
			
				
			//find the correct variable, use indexOf ot get string without the type at the end. Check if it equals user input
			
		//Handles editing functions
		} else if (editOption == "function"){
			//Gets the name of the function the user wants to edit, checks if it actually exists before proceeding
			let itemToEdit = prompt("What is the name of the function you'd like to edit?");
			if ($('[name="' + name + '"] .functions').children() == undefined){
				prompt("Cannot edit a function that doesn't exist")
			} else {
			//Figures out what the user is trying to edit
			let whatToEdit : string = prompt("Would you like to edit the name, the return type or the parameters? (Please enter 'name', 'type' or 'parameters' ");

			//If the user wants to edit the name of their function
			if (whatToEdit == "name"){

				//Gets the name name for the function from the user
				let newName : string = prompt("What would you like to rename it to? (Don't include parentheses)");

				//Goes inside the right classblock and finds the function div to edit the correct function
				$('[name="' + name + '"] .functions').children().each(function() {
					let editFunction : Array<string> = $(this).text().split(" ");
	
					if(editFunction[1] === itemToEdit) {
						editFunction[1] = newName;
						$(this).html("<i>" + editFunction[0] + "</i> " + editFunction[1] + " <strong>" + editFunction[2] + "</strong>");
					}
				});

			//Handles editing types of functions
			} else if(whatToEdit == "type"){
				let newType : string = prompt("What is the new return type for this function?")
				$('[name="' + name + '"] .functions').children().each(function() {
					let editFunction : Array<string> = $(this).text().split(" ");
	
					if(editFunction[1] === itemToEdit) {
						editFunction[0] = newType;
						//Updates the html to show the new return type for the function
						$(this).html("<li><i>" + editFunction[0] + "</i> " + editFunction[1] + " <strong>" + editFunction[2] + "</strong> </li>");
					}
				});

			//Handles editing the parameters of a function
			} else if(whatToEdit == "parameters"){
				let newParams : string = prompt("What are the new parameters for this function? (Enter without spaces, ex: 'interest,rate,balance')")
				$('[name="' + name + '"] .functions').children().each(function() {
					let editFunction : Array<string> = $(this).text().split(" ");	
					if(editFunction[1] === itemToEdit) {

						//Updates the parameters to contain the newly specified parameters
						editFunction[2] = newParams;

						//Updates the html to display the new parameters
						$(this).html("<li><i>" + editFunction[0] + "</i> " + editFunction[1] + " <strong>(" + editFunction[2] + ")</strong> </li>");
					}
				});
			}

		}

			
		}	
	});

	//Used to rename Classes while maintaining their position and info in the map
	$("#renameClass").click(function(){
		let oldName : string = prompt("What is the name of the class you want to rename?")
        if(back.userClasses.get(oldName)){ //Checks to make sure the name to change actually exists in the map
			let newName : string = prompt("What would you like to rename it to?");
			
			//Updates the old name to the new name
			back.userClasses.get(oldName).setName(newName);
			//Sets the new name equal to all of the old information
            back.userClasses.set(newName, back.userClasses.get(oldName));
            $('[name="' + oldName + '"] strong').text(newName);
			$('[name="' + oldName + '"]').attr("name", newName);
			//Deletes the old name so it can be reused
            back.userClasses.delete(oldName);
            
        } else {
            alert("You can't rename classes that don't exist");
        }
    });


	//save button in GUI calls backend for saving file
	$("#save").click(function() {
		back.doCommand("save");
	});

	//loads UML diagram into backend and GUI from an already saved yaml file
	$("#load").click(function() {
        back.doCommand("load");
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

		//Ensures the classname exists
		if (className != undefined){
			let input : string = prompt("Please enter the function you'd like to add to " + name);
			let parameters : string = prompt("Please enter the parameters separated by a comma (no spaces between them");
			let returnType : string = prompt("What is the return type?");

			//check for a blank entry, and defaults to void return type
			if (returnType.trim() == undefined || returnType.trim() == "") {
				returnType = "void";
			}

			let inputSplit : Array<string> = input.split(" ");

			//basically, checks for the div with that name and then appends to it. It will always append to the
			//correct div because the name is tied to each div uniquely.
			inputSplit.forEach(function(fun) {
			if (fun && back.doCommand("addfun " + className + " " + fun)[1]) {
				$('[name="' + className + '"] .functions').append("<li><i>" + returnType + "</i> " + fun + " (<strong>" + parameters + "</strong>) </li>");
			}
		});

		} else {
			alert("Cannot add functions to a class that doesn't exist");
		}
	}

	//Handles adding functions to classes
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
	function addVariable(name : string, input?: string[], load: boolean = false) {
		let className : string = $('[name="' + name + '"]').attr('name');

		//uses optional parameters to bypass both the user input prompt with the input?: parameter, and doCommand check
		//with the load parameter
		if(load == true) {
			$('[name="' + className + '"] .variables').append("<li>" + "<strong>&lt;" + input[0] + "&gt;</strong>" + input[1] + "</li>");
			return;
		}

		if (className != undefined){
			let input : string = prompt("Please enter the variable you would like to add to " + name);
			let type : string = prompt("What is the type of this variable?");


			//basically, checks for the div with that name and then appends to it. It will always append to the
			//correct div because the name is tied to each div uniquely.
			//add each of the elements based on the split user input
			if (input && type && back.doCommand("addvar " + className + " " + type + " " + input)[1]) {
				//this setup lets us find the exact div to add based on the HTML 'name' tag.
				$('[name="' + className + '"] .variables').append("<li>" + "<strong>[" + type + "]</strong>" + input + "</li>");
			} else {
				alert("Please enter a valid variable name/type")
			}


		} else {
			alert("Cannot add variable. Class \"" + name + "\" doesn't exist");
		}
	}

	//Handles adding variables to classblocks
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
		let parentDiv = $('[name="' + name + '"]').attr("name");
		
		//prevents connecting to an undefined/null classblock
		//Connects parents and children
		if (parentDiv != undefined) {
			let childName = prompt("Please enter the name of the new child block");
			let rType = prompt("relationship type");//will switch to radio buttons
			//temporary check
			while(!(rType === "strong" || 
					rType === "weak" || 
					rType === "is-a" || 
					rType === "impl")) {
				rType = prompt('please enter a correct category\nstrong, weak, is-a, impl');
			}
			//Ensures you enter a name for the child
			if (childName == undefined || childName == null) {
				alert("Please enter a valid child name");
				return;
			} else {
				//create a block with that name and draw a line to it (if it doesnt exist already)
				if (!back.userClasses.has(childName)) {
					addBlock(childName);
				}

				//code to draw line
				let childDiv =$('[name="' + childName + '"]');
				var ep1 = jsPlumb.addEndpoint(name, {
					connectorOverlays:[ 
						[ "PlainArrow", { width:10, length:30, location:1, id:"arrow" } ],
						[ "Label", { label:rType, id:"quantifier"} ]
					],
				  });
			var ep2 = jsPlumb.addEndpoint(childName);
				jsPlumb.connect({ source:ep1, target:ep2 });
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

	$("#addRelationship").click(function() {
		let name = prompt("Please enter the name of the classes you'd like to add a relationship between, followed by the type of relationship (Please enter the parent first, followed by the child, than the relationship type, separated by spaces) <Parent> <Child> <Relationship>");
		let inputSplit : Array<string> = name.split(" ");
		/*
		*inputSplit[0] = parent
		inputSplit[1] = child
		inputSplit[2] = relationship
		*/
		back.addChild(inputSplit[0], inputSplit[1], inputSplit[2]);
		let parent = $('[name="' + inputSplit[0] + '"]').attr("name");
		let child : string = inputSplit[1];
		let rType = inputSplit[2];
		//prevents connecting to an undefined/null classblock
		//Connects parents and children
		if (parent != undefined) {	
			console.log("Inside parent != undefined");
			//temporary check
			while(!(rType === "strong" ||
					rType === "weak" ||
					rType === "is-a" ||
					rType === "impl")) {
				rType = prompt('please enter a correct category\nstrong, weak, is-a, impl');
			}
			//Ensures you enter a name for the child
			if (child == undefined || child == null) {
				console.log("Inside child == undefined || child == null")
				alert("Please enter a valid child name");
				return;
			} else {
				//create a block with that name and draw a line to it (if it doesnt exist already)
				if (!back.userClasses.has(child)) {
					addBlock(child);
				}
				//code to draw line
				var ep1 = jsPlumb.addEndpoint(parent, {
					connectorOverlays:[
						[ "PlainArrow", { width:10, length:30, location:1, id:"arrow" } ],
						[ "Label", { label:rType, id:"quantifier"} ]
					],
				  });
				var ep2 = jsPlumb.addEndpoint(child);
				jsPlumb.connect({ source:ep1, target:ep2 });
			}
		} else {
			alert("Cannot add a child to a class that doesn't exist");
		}
	});
	//Strong relationship - Child depends on the parent, if the parent is deleted the child/children should be deleted
	//Weak relationship - If a parent is deleted, the children should stay
	//is-a relationship - The child has to inherit all the parent functions and variables,
	//If you delete a parent, the child for "is-a" stays but loses all of the parents functions/variables
	//
	$("#deleteRelationship").click(function() {
		let name = prompt("Please enter the name of the two classes you'd like to delete the relationship from, separated by a space(<Parent> <Child>)");
		let inputSplit : Array<string> = name.split(" ");
		/*
		inputSplit[0] = parent
		inputSplit[1] = child
		*/

		let child: string = inputSplit[0];
		let parent: string = inputSplit[1];

		let relationshipType = 'poop';
		if(relationshipType == "strong"){
			//Deletes child
			back.deleteChild(child, parent)
			jsPlumb.remove(parent)
		} else {
		}
		if (back.getParent(parent)){
			back.deleteChild(child, parent);
			back.removeParent(parent);
		} else {
			alert("There is no parent for " + parent + "named " + child)
		}

	});


	//deletes class both in the GUI and backend
	function deleteClass(name : string){
		let classToDelete = $('[name="' + name + '"]');

		//find div based on name and remove the entire classblock, including all child elements
		if (back.userClasses.get(name)){
			if(confirm("Are you sure you want to delete this class?") && back.doCommand("delete " + name)[1]){
				jsPlumb.remove(name);
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


	/*
	* Edits the relationship between classes
	* used when you want to change an existing relationship between classes to something else
	*/
	$("#editRelationship").click(function() {
		let name = prompt("Please enter the name of the two classes you'd like to edit the relationship between, followed by the new type of relationship, separated by a space(<Parent> <Child> <Relationship>)");
		let inputSplit : Array<string> = name.split(" ");
		/*
		inputSplit[0] = parent
		inputSplit[1] = child
		inputSplit[2] = relationship
		*/
		let parent = $('[name="' + inputSplit[0] + '"]').attr("name");
		let child: string = inputSplit[1]
		let rType: string = inputSplit[2]
		if (parent != undefined) {	
			console.log("Inside parent != undefined");
			//temporary check
			while(!(rType === "strong" ||
					rType === "weak" ||
					rType === "is-a" ||
					rType === "impl")) {
				rType = prompt('please enter a correct category\nstrong, weak, is-a, impl');
			}
			//Ensures you enter a name for the child
			if (child == undefined || child == null) {
				console.log("Inside child == undefined || child == null")
				alert("Please enter a valid child name");
				return;
			} else {
				//create a block with that name and draw a line to it (if it doesnt exist already)
				if (!back.userClasses.has(child)) {
					back.modifyRelationship(parent, child, rType);
					addBlock(child);
				}
				//code to draw line
				var ep1 = jsPlumb.addEndpoint(parent, {
					connectorOverlays:[
						[ "PlainArrow", { width:10, length:30, location:1, id:"arrow" } ],
						[ "Label", { label:rType, id:"quantifier"} ]
					],
				  });
				var ep2 = jsPlumb.addEndpoint(child);
				jsPlumb.connect({ source:ep1, target:ep2 });
			}
		} else {
			alert("Cannot add a child to a class that doesn't exist");
		}
	});










	//Handles the dragging of classblocks
	//Allows classblocks to be dragged
	$('#blockArea').on("mousedown", ".classblock", function(e) {
		dragBlock();
	});

	$('#blockArea').on("", ".classblock", function(e) {
			let checkBlock = $(this).position();
			console.log(checkBlock.left, checkBlock.top);

			if(checkBlock.top < 0) {
				console.log("we got to check the top");
				$(this).css("top", "10px");
			}

			if(checkBlock.left < 75) {
			console.log("we got to check the left");
			$(this).css("left", "25px");
			}
	});


	function dragBlock() {
		let classBlock = jsPlumb.getInstance();
		classBlock.draggable($(".classblock"), {
				//containment: '#blockArea',
        		drag:function() {
				//need to repaint everything so the relationship lines follow.
				jsPlumb.repaintEverything();
			}
		});
		
	}



	
	//need to sleep while user selects file
	const sleep = (milliseconds) => {
 		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	/** Listens to inputFile and loads a file selected from windows prompt
	 * Basically a way to seperate selecting a file from actually loading it
	 * also does loading in the GUI. needs to be put here due to synchinpmng issues 
	**/
	$("#inputFile").on("change", function () {
		//back.loadFile();

		//does the actual loading in the GUI
		if($("#blockArea") != undefined) {
			//clear block area for loading
			$("#blockArea").html("");

			sleep(500).then(() => {
				//turn the userClasses map into an array and iterate through it
				for (let key of Array.from(back.userClasses.keys())) {

            	    addBlock(key, true);

            	    //get variables and functions into arrays based on the key value in the map
	                let variables = back.userClasses.get(key).getVars();
    	            let functions = back.userClasses.get(key).getFun();
    				
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
			if (command.val() == "clear") {
				log.val("");
				command.val("");
			} else if (command.val() == "")
				apdLog("", log);
			else {
				apdLog(">" + command.val(), log);
				apdLog (<string>back.doCommand(<string>command.val())[0], log);
				log.scrollTop(log[0].scrollHeight);
				command.val("");
			}
		}
	});
});

    /** apdLog (string, JQuery textfield)
     * Appends a string to the consoles log on a new line
    **/
    function apdLog(newText: string, log: JQuery) {
        log.val(log.val() + "\n" + newText);
	}
	
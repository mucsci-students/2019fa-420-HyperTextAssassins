/// <reference path="classblock.ts" />

let userClasses = new Map();

$(function() {
	//vars

	//do on page load

	$("#log").val("UML Terminal\n>help");
	$("#command").focus();

	//do on event

	$("body").click(function(){
		let firstClass = "FirstClass";
		$("body").append("<div class= \"classblock\" id =\"" + firstClass + "\"> classblock </div>");
		console.log("Did thing");

		
		let thing2 = "thing2";	
		//Bug: Overwrites first div, should create a second div
		$("body").append("<div class= \"classblock\" id =\"" + thing2 + "\"> classblock </div>");
		console.log("Did thing");
	});

	/** Listens to inputFile and loads a file selected from windows prompt
	 * Basically a way to seperate selecting a file from actually loading it
	**/
	$("#inputFile").on("change", function () {loadFile();});

	//runs every time key is pressed when #command is focus
	$("#command").on('keypress', function(e) {
		//checks if enter key is pressed
		if(e.which === 13) {
			let command : JQuery = $("#command");
			doCommand(<string>command.val());
			command.val("");
		}
	});
});

//called functions

/** help (string)
 * is called when user gives an arguement to the help command
 * returns a string explaining specified command to the user
**/
function help(cmd : string) {
	switch (cmd){
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
			return cmd + " is not a command"
	}
}

/** doCommand (string)
 * checks user input for command and executes it if it exists
 * otherwise only returns users input
**/
function doCommand(command : string) {
	let log : JQuery = $("#log");
		
	apdLog(">" + command, log);

	//reg expression for split to allow any number of spaces
	let args : Array<string> = (command.split(/\s{1,}/));
	args[0] = args[0].toLocaleLowerCase();

	switch (args[0]) {
		case "clear":
			log.val("")	
		break;

		case "help":
			if (args.length > 1) {
				apdLog(help(args[1]), log);
			} else {
				apdLog(("list of commands\n"
						+ ">clear\n"
						+ ">create\n"
						+ ">delete\n"
						+ ">rename\n"
						+ ">print\n"
						+ ">printall\n"
						+ ">save\n"
						+ ">load\n"
						+ "type >help <command> for instructions on that command")
				, log);
			}
		break;

		case "create":
			if (userClasses.has(args[1])) {
				apdLog("Name already in use. Please enter unique name.", log);
			} else if (args.length < 2 || args[1] == "") {
				apdLog("Please enter a name after create, type <help> <create> for more info", log);
			} else {
				userClasses.set(args[1], new classBlock(args[1]));
				apdLog(userClasses.get(args[1]).getName() + " created", log);
			}
		break;

		case "delete":
			if (userClasses.has(args[1])) {
				userClasses.delete(args[1]);
				apdLog(args[1] + " deleted", log);
			} else {
				apdLog(args[1] + " class does not exist", log);
			}
		break;

		case "print":
			if (userClasses.has(args[1])) {
				apdLog(userClasses.get(args[1]).print(), log);
			} else {
				apdLog(args[1] + " class does not exist", log);
			}
		break;

		case "printall":
			userClasses.forEach((block : classBlock) => {
				apdLog(block.print(), log);
			});
		break;

		case "rename":
			if (args.length != 3) {
				apdLog("Please use this format: >rename <targetclass> <newname>", log);
				break;
			} else if (!userClasses.has(args[1])) {
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
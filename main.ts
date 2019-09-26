/// <reference path="classblock.ts" />

let userClasses = new Map();

$(function() {
	//vars

	//do on page load

	$("#log").val("UML Terminal\n>help");
	$("#command").focus();

	//do on event

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
			return ">help\n"
			+ " Is helpful";
		break;

		case "create":
			return ">create\n"
			 + " Creates a block";
		break;

		case "printall":
			return ">printall\n"
			+ " Prints all current classes and their information";
		break;

		case "rename":
			return ">rename <targetclass> <newname>\n"
			+ " Changes a classes name";
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
						+ ">rename\n"
						+ ">printall\n"
						+ "type >help <command> for instructions on that command")
				, log);
			}
		break;

		case "create":
			if (userClasses.has(args[1])) {
				apdLog("Name already in use. Please enter unique name.", log);
			} else {
				userClasses.set(args[1], new classBlock(args[1]));
				apdLog(userClasses.get(args[1]).getName() + " created", log);
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
			}
			apdLog(rename(args[1], args[2]), log);
		break;

		case "save":
			saveFile();
		break;

		case "load":
			loadFile();
		break;

		//used to access loading a file.
		case "loadfile":
			$("#inputFile").removeClass('hidden');
			$("#load").removeClass('hidden');
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
	var File = (<HTMLInputElement>document.getElementById("inputFile")).files[0];

	// Using a FileReader to read the contents of the file as regular text.
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		var textFromFile = fileLoadedEvent.target.result;
		// Printing the text into the textarea.
		(<HTMLInputElement>document.getElementById("text")).value = <string>textFromFile;

		userClasses.clear();
		let test : Array<classBlock> = jsyaml.safeLoad(<string>textFromFile);
		for (let i : number = 0; i < test.length; i++) {
			userClasses.set(test[i][0], new classBlock(test[i][1]["name"]));
		}

	};

	fileReader.readAsText(File, "UTF-8");

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
    document.getElementById("link").innerHTML = "<a href=" + uriContent + " download=\"diagram.yml\">click me</a>";
}

/** apdLog (string, JQuery textfield)
 * Appends a string to the consoles log on a new line
**/
function apdLog(newText : string, log : JQuery){
	log.val(log.val() + "\n" + newText);
}
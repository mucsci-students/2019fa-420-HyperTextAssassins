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
			return "Clears terminal log";
		break;

		case "help":
			return "Is helpful";
		break;
	}
}

/** doCommand (string)
 * checks user input for command and executes it if it exists
 * otherwise only returns users input
**/
function doCommand(command : string){
	let log : JQuery = $("#log");
		
	apdLog(command, log);

	//reg expression for split to allow any number of spaces
	command = command.toLocaleLowerCase();
	let args : Array<string> = (command.split(/\s{1,}/));

	switch (args[0]) {
		case "clear":
			log.val("")	
		break;

		case "help":
			if (args.length > 1){
				apdLog(help(args[1]), log);
			} else {
				apdLog(("list of commands\n"
						+ ">clear\n"
						+ "type >help <command> for instructions on that command")
				, log);
			}
		break;
		//used to access loading a file.
		case "loadfile":
			$("#inputFile").removeClass('hidden');
			$("#load").removeClass('hidden');
		break;
	}
	log.scrollTop(log[0].scrollHeight);	
}

/**
 * Loads and writes the text contents
 * 		of a file into the html textarea.
 */
function loadFile() {
	$("#text").removeClass('hidden');
	$("#save").removeClass('hidden');

	// Grabs the file selected from the file input button.
	var File = (<HTMLInputElement>document.getElementById("inputFile")).files[0];

	// Using a FileReader to read the contents of the file as regular text.
	var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
		var textFromFile = fileLoadedEvent.target.result;
		// Printing the text into the textarea.
		(<HTMLInputElement>document.getElementById("text")).value = <string>textFromFile;
	};
	
	fileReader.readAsText(File, "UTF-8");

}

/**
 * Saves the text from the textarea into a new YAML file.
 */
function saveFile() {
	var textContent = (<HTMLInputElement>document.getElementById("text")).value;

	// The octet-stream indicates a binary file.
	// The URI encoder will encode the UTF-8 text.
	var uriContent = "data:application/octet-stream," + encodeURIComponent(textContent);
	
	// Creates a clickable link to either open or save the file that was just create.
    document.getElementById("link").innerHTML = "<a href=" + uriContent + " download=\"diagram.yml\">click me</a>";
}

/** apdLog (string, JQuery textfield)
 * Appends a string to the consoles log on a new line
**/
function apdLog(newText : string, log : JQuery){
	log.val(log.val() + "\n" + newText);
}
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
		
	log.val(log.val() + "\n>" + command);

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
	}
	log.scrollTop(log[0].scrollHeight);	
}

/** apdLog (string, JQuery textfield)
 * Appends a string to the consoles log on a new line
**/
function apdLog(newText : string, log : JQuery){
	log.val(log.val() + "\n" + newText);
}
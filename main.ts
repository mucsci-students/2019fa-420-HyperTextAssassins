$(function() {
	//Vars

	//Do at start
	$("#log").val("UML Terminal\n>help");
	$("#command").focus();

	//Do on event
	$("#command").on('keypress', function(e) {
		if(e.which === 13) {
			let command : JQuery = $("#command");
			doCommand(<string>command.val());
			command.val("");
		}
	});
});

//called functions

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

function doCommand(command : string){
	let log : JQuery = $("#log");
		
	log.val(log.val() + "\n>" + command);
			
	let args : Array<string> = (command.split(" "));
	
	switch (args[0]) {
		case "clear":
			log.val("")	
		break;

		case "help":
			if (args.length > 1){
				log.val(log.val() + "\n" + help(args[1]));
			} else {
				log.val(log.val() + "\n" + "There is no help")
			}
		break;
	}
	log.scrollTop(log[0].scrollHeight);	
}
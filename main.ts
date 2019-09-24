/// <reference path="classblock.ts" />

let userClasses = new Map();

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
	//reg expression for split to allow any number of spaces
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

		case "create":
			if (userClasses.has(args[1]))
			{
				log.val(log.val() + "\n" + "Name already in use. Please enter unique name.");
			}
			else 
			{
				let classs: classBlock = new classBlock(args[1]);
				log.val(log.val() + "\n" + classs.name + " Created");
				userClasses.set(args[1], new classBlock(args[1]));
			}
		break;

		case "print":
		if (args[1] == "all")
		{
			let keys = Array.from( userClasses.keys() );
			for (let i = 0; i < userClasses.size; i++)
			{
				log.val(log.val() + "\n" + keys[i])
			}
		}
		log.val(log.val() + "\n" + userClasses.get(args[1]).name + " is the name of this class");
		
		break;

		case "edit":
		let checkDups = args[2];
		if (args.length != 3)
		{
			log.val(log.val() + "\n" + "Please use this format: " + "edit [current name of class] [new name of class]");
			break;
		}
		if(userClasses.has(checkDups))
		{
			log.val(log.val() + "\n" + "Please enter a unique class name")
		}
		else if(!userClasses.has(checkDups))
		{
			let updatedClass: classBlock = new classBlock(args[2]);
			userClasses.set(args[2], new classBlock(userClasses.get(args[1])))
			log.val(log.val() + "\n" + "Changed name of class from " + args[1] + " to " + args[2])
			userClasses.delete(args[1]);
		}
		break;
			
	}
	log.scrollTop(log[0].scrollHeight);
}
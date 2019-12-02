import { classBlock } from './classBlock'
import { safeDump, safeLoad } from 'js-yaml'


export class backEnd {

    public userClasses = new Map<string, classBlock>();

    constructor() {
    }

    /** help (string)
     * is called when user gives an arguement to the help command
     * returns a string explaining specified command to the user
    **/
    help(cmd: string) {
        switch (cmd) {
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
                return ">addvar <targetclass> <type> <var>\n"
                    + " Adds a variable to target class";

            case "editvartype":
                return ">editvartype <targetclass> <newtype> <targetvar>\n"
                    + " Changes the type of the target variable";

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

            case "removeparent":
                return ">removeparent <targetclass>\n"
                    + " Removes the parent of a classblock." 
                    
            case "addparent":
                return ">addparent <targetclass> <parentclass> <relationship>\n"
                    + " Adds a parent to a classblock."
                    
            case "getparent":
                return ">getparent <targetclass>\n"
                    + " Returns the parent of a classblock."
                    
            case "deletechild":
                return ">deletechild <targetclass> <childclass>\n"
                    + " Removes a specific child from a classblock."
                    
            case "getchildren":
                return ">getchildren <targetclass>\n"
                    + " Returns all of the children for a classblock."
                
            case "addchild":
                return ">addchild <targetclass> <childclass> <relationship>\n"
                    + " Adds a child to a classblock."
            case "modrel":
                return ">modrel <parentclass> <childclass> <relationship>"
            default:
                return cmd + " is not a command"
        }
    }

    /** doCommand (string) returns tuple of [string, bool]
     * checks user input for command and executes it if it exists
     * otherwise only returns users input
    **/
    doCommand(command: string) {

        //reg expression for split to allow any number of spaces
        let args: Array<string> = (command.split(/\s{1,}/));
        args[0] = args[0].toLocaleLowerCase();

        switch (args[0]) {

            case "help":
                if (args.length > 1) {
                    return [this.help(args[1]), true];
                } else {
                    return ["list of commands\n"
                        + ">clear\n"
                        + ">create\n"
                        + ">delete\n"
                        + ">rename\n"
                        + ">addvar\n"
                        + ">delvar\n"
                        + ">editvartype\n"
                        + ">addfun\n"
                        + ">delfun\n"
                        + ">print\n"
                        + ">printall\n"
                        + ">save\n"
                        + ">load\n"
                        + ">addchild\n"
						+ ">deletechild\n"
						+ ">getchildren\n"
						+ ">addparent\n"
						+ ">getparent\n"

                        + ">removeparent\n"
                        + ">modrel\n"

                        + "type >help <command> for instructions on that command", true];
                }

            case "create":
                if (this.userClasses.has(args[1])) {
                    return ["Name already in use. Please enter unique name.", false];
                } else if (args.length < 2 || args[1] == "") {
                    return ["Please enter a name after create, type <help> <create> for more info", false];
                } else {
                    this.userClasses.set(args[1], new classBlock(args[1]));
                    return [this.userClasses.get(args[1]).getName() + " created", true];
                }

            case "delete":
                if (args.length != 2) {
                    return ["Please use this format: >delete <targetclass>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " class does not exist", false];
                } else {
                    return [this.deleteClassBlock(args[1]), true];
                }

            case "addvar":
                if (this.userClasses.has(args[1])) {
                    if (args.length < 4 || args[3] == "") {
                        return ["Please enter a target class, type, and name after addvar, type <help> <addvar> for more info", false];
                    } else if (this.userClasses.get(args[1]).setVar(args[2], args[3])) {
                        return ["Var <" + args[2] + "> " + args[3] + " added to " + args[1], true];
                    } else {
                        return ["Var " + args[3] + " already exists in " + args[1], false];
                    }
                } else {
                    return [args[1] + " class does not exist", false];
                }

            case "editvartype":
                if (this.userClasses.has(args[1])) {
                    if (args.length < 4 || args[3] == "") {
                        return ["Please enter a target class, new type, and variable after editvartype, type <help> <editvartype> for more info", false];
                    } else if (this.userClasses.get(args[1]).editVar(args[2], args[3])) {
                        return ["Var " + args[3] + " is now type <" + args[2] + "> in " + args[1], true];
                    }
                } else {
                    return [args[1] + " class does not exist", false];
                }

            case "delvar":
                if (this.userClasses.has(args[1])) {
                    if (this.userClasses.get(args[1]).removeVar(args[2])) {
                        return ["Var " + args[2] + " deleted from " + args[1], true];
                    } else {
                        return ["Var " + args[2] + " does not exist in " + args[1], false];
                    }
                } else {
                    return [args[1] + " class does not exist", false];
                }

            case "addfun":
                if (this.userClasses.has(args[1])) {
                    if (this.userClasses.get(args[1]).setFun(args[2])) {
                        return ["Fun " + args[2] + " added to " + args[1], true];
                    } else {
                        return ["Fun " + args[2] + " already exists in " + args[1], false];
                    }
                } else {
                    return [args[1] + " class does not exist", false];
                }

            case "delfun":
                if (this.userClasses.has(args[1])) {
                    if (this.userClasses.get(args[1]).removeFun(args[2])) {
                        return ["Fun " + args[2] + " deleted from " + args[1], true];
                    } else {
                        return ["Fun " + args[2] + " does not exist in " + args[1], false];
                    }
                } else {
                    return [args[1] + " class does not exist", false];
                }

            case "print":
                if (this.userClasses.has(args[1])) {
                    return [this.userClasses.get(args[1]).print(), true];
                } else {
                    return [args[1] + " class does not exist", false];
                }

            case "printall":
                let newLines: number = this.userClasses.size;
                let blocks: string = "";
                this.userClasses.forEach((block: classBlock) => {
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
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                }
                return [this.rename(args[1], args[2]), true];


            case "save":
                this.saveFile();
                return ["Saving", true];

            case "load":
                this.selectFile();
                return ["Loading", true]

            case "addparent":
                if (args.length != 4) {
                    return ["format: >addparent <targetclass> <parentclass> <relationship>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                } else if (!this.userClasses.has(args[2])) {
                    return [args[2] + " does not exist", false];
                }				
                return [this.addParent(args[1], args[2], args[3]), true];
                
            case "getparent": 
                if (args.length != 2) {
                    return ["format: >getparent <targetclass>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                }
                return [this.getParent(args[1]), true];
        
            case "removeparent":
                if (args.length != 2) {
                    return ["format: >removeparent <targetclass>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                }
                return [this.removeParent(args[1]), true];
        
            case "addchild":
                if (args.length != 4) {
                    return ["format: >addchild <targetclass> <childclass> <relationship>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                } else if (!this.userClasses.has(args[2])) {
                    return [args[2] + " does not exist", false];
                }
                return [this.addChild(args[1], args[2], args[3]), true];
        
            case "getchildren":
                if (args.length != 2) {
                    return ["format: >getchildren <targetclass>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                }
                return [this.getChildren(args[1]), true];
        
            case "deletechild":
                if (args.length != 3) {
                    return ["format: >deletechild <targetclass> <childclass>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                } else if (!this.userClasses.has(args[2])) {
                    return [args[2] + " does not exist", false];
                }
                return [this.deleteChild(args[1], args[2]), true];

            case "modrel":
                if (args.length != 4) {
                    return ["format: >modrel <targetclass> <childclass> <relationship>", false];
                } else if (!this.userClasses.has(args[1])) {
                    return [args[1] + " does not exist", false];
                } else if (!this.userClasses.has(args[2])) {
                    return [args[2] + " does not exist", false];
                } else if (!(args[3] === "strong" || 
                        args[3] === "weak" || 
                        args[3] === "is-a" || 
                        args[3] === "impl")) {
                        return [args[3] + " is not a valid relationship", false];
                    }
                return [this.modifyRelationship(args[1], args[2], args[3]), true];

            default:
                return [args[0] + " is not a command", false];
        }
    }
/* Called Functions */

    /**
     * Function for deleting a classblock.
     * Needs to check if the classblock has children,
     * 	if so it will delete accordingly based on their relationship.
     * @param targetClass 
     */
    deleteClassBlock(targetClass : string)
    {
	    var target = this.userClasses.get(targetClass);
	    //checking for children.
	    if (target.getChildren().length > 0) {
		    //Runs through each child and performs the correct action.
		    //Based on their relationship with the classblack we are deleting.
		    target.getChildren().forEach(child => {
			    var c = this.userClasses.get(child[0]);
			    c.removeParent();
			    if (child[1] === "strong") {
				    this.userClasses.delete(child[0]);
			    }
		    });
	    }
	    //checking if a parent exists.
	    if (target.getParent()[0] != null) {
		    this.userClasses.get(target.getParent()[0]).removeChild(targetClass);
	    }
	    this.userClasses.delete(targetClass);
	    return (targetClass + " has been deleted.");
    }

    /**
     * Returns the array of children for a specific class block.
     * @param targetClass 
     */
    getChildren(targetClass: string) {
        var temp = this.userClasses.get(targetClass).getChildren();
	    var children = new Array();
        if(temp.length <= 0) {
            return ("This class has no children");
	    }
	    for (var c in temp) {
		    children.push(temp[c][0]);
	    }
        return ("children: " + children);
    }

    /**
     * Adds a child class to a specific class block.
     * @param targetClass 
     * @param childClass 
     */
    addChild(targetClass : string, childClass : string, relationship : string)
    {   
	    var target = this.userClasses.get(targetClass);
	    var child = this.userClasses.get(childClass);
	    if (target.getParent()[0] === childClass) {
		    return (targetClass + " is already a child of " + childClass);
	    }
        target.addChild(childClass, relationship);
        child.setParent(targetClass, relationship);
        return ("added " + childClass + " as a child to " + targetClass + ".");
}

    /**
     * Allows you to remove a child from a parents children array.
     * @param targetClass 
     * @param childClass 
     */
    deleteChild(targetClass: string, childClass: string) {
        if((this.userClasses.get(targetClass).getChildIndex(childClass)) > -1) {
            this.userClasses.get(targetClass).removeChild(childClass);
            this.userClasses.get(childClass).removeParent();
            return ("Removed " + childClass + " from the children's array of " + targetClass + ".");
        }
        return (childClass + " is not a child of " + targetClass + ".");
    }

    /**
     * Returns the parent of a specific class block.
     * @param targetClass 
     */
    getParent(targetClass: string) {
        if (this.userClasses.get(targetClass).getParent()[0] == null) {
            return ("There is no parent class for " + targetClass + ".");
        }
        return ("The parent of " + targetClass + " is " + this.userClasses.get(targetClass).getParent() + ".");
    }

    /**
     * Adds a parent to a specific class block.
     * @param targetClass 
     * @param parentClass 
     * @param relationship 
     */
    addParent(targetClass : string, parentClass : string, relationship : string)
    {
	    var target = this.userClasses.get(targetClass);
	    var parent = this.userClasses.get(parentClass);
	    if (parent.getParent()[0] === targetClass) {
		    return (targetClass + " is already the parent of " + parentClass);
	    }
        target.setParent(parentClass, relationship);
        parent.addChild(targetClass, relationship);
        return ("Added " + parentClass + " as the parent for " + targetClass);
    }

    /**
     * Removes the current parent of the targetClass.
     * @param targetClass 
     */
    removeParent(targetClass: string) {
        var parent = this.userClasses.get(targetClass).getParent()[0];
	    this.userClasses.get(parent).removeChild(targetClass);
	    this.userClasses.get(targetClass).removeParent();


	    return ("Removed the parent of " + targetClass + ".");
    }

    /**
     * The ability to change an existing type of relationship
     *  E.g. change from strong to weak.
     * @param parentClass 
     * @param childClass  
     * @param relationship
     */
    modifyRelationship(parentClass: string, childClass: string, relationship: string) {
        var target = this.userClasses.get(parentClass);
        var child = this.userClasses.get(childClass);
        var children = target.getChildren();
        var index = target.getChildIndex(childClass);
        if (index < 0) {
            return false;
        }
        children[index][1] = relationship;
        child.getParent()[1] = relationship;

        return ("Changed the relationship of " + parentClass + " and " + childClass + " to " + relationship + ".");
    }

    /** rename (string, string) returns string
     * Renames a class
    **/
    rename(oldName: string, newName: string) {
        if (this.userClasses.has(newName)) {
            return "Please enter a unique class name";
        } else {
            this.userClasses.get(oldName).setName(newName);
            this.userClasses.set(newName, this.userClasses.get(oldName));
            this.userClasses.delete(oldName);
            return ("Changed the name of class " + oldName + " to " + newName);
        }
    }

    /**
     * Loads and writes the text contents
     * 		of a file into the html textarea.
     */
      loadFile() {
        // Grabs the file selected from the file input button.
        //var File = (<HTMLInputElement>document.getElementById("inputFile")).files[0];
    	
        let inputFile = $("#inputFile");
    
        var file : File = inputFile.prop('files')[0];
    
        // Using a FileReader to read the contents of the file as regular text.
        
        /*
        var fileReader : FileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent){
            //var textFromFile = fileLoadedEvent.target.result;
            var textFromFile = fileReader.result;
            userClasses.clear();
            let yaml : Array<classBlock> = jsyaml.safeLoad(<string>textFromFile);
            for (let i : number = 0; i < yaml.length; i++) {
                this.userClasses.set(yaml[i][0], new classBlock(yaml[i][1]["name"]));
                yaml[i][1]["vars"].forEach(function(j) {
                    this.userClasses.get(yaml[i][0]).setVar(j[0], j[1]);
                });
                yaml[i][1]["funs"].forEach(function(j) {
                    this.userClasses.get(yaml[i][0]).setFun(j);
                });
                this.userClasses.get(yaml[i][0]).setParent(yaml[i][1]["parent"]);
                yaml[i][1]["children"].forEach(function(j) {
                    this.userClasses.get(yaml[i][0]).addChild(j);
                });
            }
        }

        fileReader.readAsText(file, "UTF-8");
        */
    }

    selectFile() {
        $("#inputFile").click();
    }

    /**
     * Saves the text from the textarea into a new YAML file.
     */
    saveFile() {
        //var textContent = (<HTMLInputElement>document.getElementById("text")).value;
        let diagramYaml: string = safeDump(Array.from(this.userClasses));

        // The octet-stream indicates a binary file.
        // The URI encoder will encode the UTF-8 text.
        var uriContent = "data:application/octet-stream," + encodeURIComponent(diagramYaml);

        // Creates a clickable link to either open or save the file that was just create.
        document.getElementById("link").outerHTML = "<a id=\"link\" href=" + uriContent + " download=\"diagram.yml\" class=\"hidden\">click me</a>";
        document.getElementById("link").click();
    }

}

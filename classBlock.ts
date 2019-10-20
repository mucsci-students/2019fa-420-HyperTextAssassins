class classBlock {
	private name : string;
	private vars : Set<string> = new Set();
	private funs : Set<string> = new Set();
	private parent: string = null;
	private children : string[] = new Array();

	constructor (name : string) {
		this.name = name;
	}
		
	/** print () returns string
	 * Prints formatted contents of class called from
	**/
	print() {
		let classOut : string = "Class : " + this.name;
		if (this.vars.size > 0) {
			classOut += " Variables :";
			this.vars.forEach(function(i) {
				classOut += " " + i; 
			});
		}
		if (this.funs.size > 0) {
			classOut += " Functions :";
			this.funs.forEach(function(i) {
				classOut += " " + i; 
			});
		}
		return classOut;
	}

	/** setName (string) returns string
	 * Returns the name of the class called from
	**/
	getName()
	{
		return this.name;
	}

	/** setName (string) returns bool
	 * Sets the name of the class called from
	**/
	setName(name : string)
	{
		this.name = name;
		return true;
	}

	/** setVar (string) returns bool
	 * Creates a new variable in a classBlock
	**/
	setVar(vari : string) {
		if (this.vars.has(vari))
			return false;
		this.vars.add(vari);
		return true;
	}

	/** isVar (string) returns bool
	 * checks if a variable exists inside a classBlock
	**/
	isVar(vari : string) {
		return this.vars.has(vari);
	}

	/** removeVar (string) returns string
	 * Removes a variable from a classBlock
	**/
	removeVar(vari : string) {
		return this.vars.delete(vari);
	}

	/** setFun (string) returns bool
	 * Creates a new function in a classBlock
	**/
	setFun(fun : string) {
		if (this.funs.has(fun))
			return false;
		this.funs.add(fun);
		return true;
	}

	/** isFun (string) returns bool
	 * checks if a function exists inside a classBlock
	**/
	isFun(func : string) {
		return this.funs.has(func);
	}

	/** removeFun (string) returns string
	 * Removes a function from a classBlock
	**/
	removeFun(fun : string) {
		return this.funs.delete(fun);
	}

	/**
	 * Allows you to set the parent of the classblock.
	 * @param parent 
	 */
	setParent(parent: string)
	{
		this.parent = parent;
		return true;
	}

	/**
	 * Set the current parent to NULL.
	 */
	removeParent()
	{
		this.parent = null;
		return true;
	}

	/**
	 * Returns the parent of the classblock.
	 */
	getParent()
	{
		return this.parent;
	}
	/**
	 * Allows you to add a classblock to the children's array.
	 * @param child 
	 */
	addChild(child: string)
	{
		this.children.push(child);
		return true;
	}
	/**
	 * Returns the children of the classblock.
	 */
	getChildren() 
	{
		return this.children;
	}

	/**
	 * Removes a specific child from the childrens array.
	 * @param child 
	 */
	removeChild(child: string)
	{
		var index = this.children.indexOf(child);
		this.children.splice(index, 1);
		return true;
	}
}

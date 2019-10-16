class classBlock {
	private name : string;
	private parent: string = null;
	private children : string[] = new Array();

	constructor (name : string) {
		this.name = name;
	}
		
	/** print () returns string
	 * Prints formatted contents of class called from
	**/
	print()
	{
		let classOut : string = "Class : " + this.name;
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




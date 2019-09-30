class classBlock {
	private name : string;

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
}

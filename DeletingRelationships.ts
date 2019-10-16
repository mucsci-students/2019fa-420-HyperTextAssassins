
	/**
	 * Set the current parent to NULL.
	 */
	removeParent()
	{
		this.parent = null;
		return true;
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



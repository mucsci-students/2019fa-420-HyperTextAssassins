var classBlock = /** @class */ (function () {
    function classBlock(name) {
        this.name = name;
    }
    /** print () returns string
     * Prints formatted contents of class called from
    **/
    classBlock.prototype.print = function () {
        var classOut = "Class : " + this.name;
        return classOut;
    };
    /** setName (string) returns string
     * Returns the name of the class called from
    **/
    classBlock.prototype.getName = function () {
        return this.name;
    };
    /** setName (string) returns bool
     * Sets the name of the class called from
    **/
    classBlock.prototype.setName = function (name) {
        this.name = name;
        return true;
    };
    return classBlock;
}());

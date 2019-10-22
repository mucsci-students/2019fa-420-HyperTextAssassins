/// <reference path="../main.ts" />

describe('.doCommand() Tests', function(){

    it('.doCommand() should create a class named myName', function(){
        doCommand("create myName");
        assert.equal(userClasses.get("myName").getName(), "myName");
    });

});

describe('classBlock Tests', function(){

    it('.getName() should return myName', function(){
        const block = new classBlock('myName');
        assert.equal(block.getName(), 'myName');
    });

    it('.print() of a block with no vars or funs should return \'Class : myName\'', function(){
        const block = new classBlock('myName');
        assert.equal(block.print(), 'Class : myName');
    });

    it('set var', function(){
        const block = new classBlock('myName');
        assert.equal(block.setVar('myType', 'myVar'), true);
    });

    it('set fun', function(){
        const block = new classBlock('myName');
        block.setFun('myFun');
        assert.equal(block.isFun('myFun'), true);
    });

    it('.setVar() should fail if var already exists', function(){
        const block = new classBlock('myName');
        block.setVar('myVar');
        assert.equal(block.setVar('myVar'), false);
    });

    it('.setFun() should fail if fun already exists', function(){
        const block = new classBlock('myName');
        block.setFun('myFun');
        assert.equal(block.setFun('myFun'), false);
    });

    it('.print() of a block with vars but no funs should return \'Class : myName Variables : <myType> myVar\'', function(){
        const block = new classBlock('myName');
        block.setVar('myType', 'myVar');
        assert.equal(block.print(), 'Class : myName Variables : <myType> myVar');
    });

    it('.print() of a block with funs but no vars should return \'Class : myName Functions : myFun\'', function(){
        const block = new classBlock('myName');
        block.setFun('myFun');
        assert.equal(block.print(), 'Class : myName Functions : myFun');
    });

    it('.print() should return \'Class : myName Variables : <myType> myVar Functions : myFun\'', function(){
        const block = new classBlock('myName');
        block.setVar('myType', 'myVar');
        block.setFun('myFun');
        assert.equal(block.print(), 'Class : myName Variables : <myType> myVar Functions : myFun');
    });

});

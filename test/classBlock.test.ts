import { classBlock } from '../src/classBlock'

describe('classBlock Tests', function () {

    it('.getName() should return myName', function () {
        const block: classBlock = new classBlock('myName');
        expect(block).not.toBe(null);
    });

    it('.print() of a block with no vars or funs should return \'Class : myName\'', function () {
        const block = new classBlock('myName');
        expect(block.print()).toEqual("Class : myName");
    });

    it('.setVar() and .isVar() returns index 0', function () {
        const block = new classBlock('myName');
        block.setVar('type', 'myVar');
        expect(block.isVar('myVar')).toEqual(0);
    });

    it('.setFun() and .isFun() returns true', function () {
        const block = new classBlock('myName');
        block.setFun('myFun');
        expect(block.isFun('myFun')).toEqual(true);
    });

    it('.setVar() should fail if var already exists', function () {
        const block = new classBlock('myName');
        block.setVar('strong', 'myVar');
        expect(block.setVar('strong', 'myVar')).toEqual(false);
    });

    it('.setFun() should fail if fun already exists', function () {
        const block = new classBlock('myName');
        block.setFun('myFun');
        expect(block.setFun('myFun')).toEqual(false);
    });

    it('.print() of a block with vars but no funs should return \'Class : myName Variables : <myType> myVar\'', function () {
        const block = new classBlock('myName');
        block.setVar('myType', 'myVar');
        expect(block.print()).toEqual("Class : myName Variables : <myType> myVar");
    });

    it('.print() of a block with funs but no vars should return \'Class : myName Functions : myFun\'', function () {
        const block = new classBlock('myName');
        block.setFun('myFun');
        expect(block.print()).toEqual("Class : myName Functions : myFun");
    });

    it('.print() should return \'Class : myName Variables : <myType> myVar Functions : myFun\'', function () {
        const block = new classBlock('myName');
        block.setVar('myType', 'myVar');
        block.setFun('myFun');
        expect(block.print()).toEqual("Class : myName Variables : <myType> myVar Functions : myFun");
    });

    /* parents */
    it('.setParent() should fail if the parent being added is already the parent', function() {
        const block = new classBlock('class1');
        const block2 = new classBlock('class2');
        block.setParent('class2', 'strong');
        expect(block.setParent('class2', 'strong')).toEqual(false);
    });

    it('.removeParent should return true', function() {
        const block = new classBlock('class1');
        const block2 = new classBlock('class2');
        block.setParent('class2', 'strong');
        expect(block.removeParent()).toEqual(true);
    })

    it('.getParent() should grab the parent of a classblock', function() {
        const block = new classBlock('class1');
        const block2 = new classBlock('class2');
        block.setParent('class2', 'strong');
        expect(block.getParent()[0]).toContain('class2');
        expect(block.getParent()[1]).toContain('strong');
    });

    /* children */
    it('.addChild() should add the child to a block and return true', function () {
        const block = new classBlock('1');
        const block2 = new classBlock('2');
        expect(block.addChild('2', 'weak')).toEqual(true);
    });

    it('.getChildren() should return null if no children', function () {
        const block = new classBlock('1');
        expect(block.getChildren()).toMatch('');
    });

    it('.removeChild() should fail if the child isnt an exisiting child.', function () {
        const block = new classBlock('1');
        expect(block.removeChild('2')).toEqual(false);
    });

    it('.print() on a class with a parent should return "Class : <name> Parent : <parent>(<type>)".', function () {
        const block = new classBlock('1');
        block.setParent('2', 'strong')
        expect(block.print()).toContain("Class : 1 Parent : 2(strong)");
    });
});

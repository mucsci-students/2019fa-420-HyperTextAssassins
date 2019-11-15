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

});

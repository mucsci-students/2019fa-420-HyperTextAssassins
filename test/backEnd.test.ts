import { backEnd } from '../src/backEnd'

describe('backEnd Tests', function () {

    it('.doCommand() can create classBlocks', function () {
        let back = new backEnd();
        back.doCommand('create myClassBlock');
        expect(back.doCommand('printall')[0]).toEqual('Class : myClassBlock');
    });

    it('.doCommand() can delete created classBlocks', function () {
        let back = new backEnd();
        back.doCommand('create myClassBlock');
        back.doCommand('delete myClassBlock');
        expect(back.doCommand('printall')[0]).toEqual('');
    });

    it('.doCommand() can add children to classBlocks', function () {
        let back = new backEnd();
        back.doCommand('create class1');
        back.doCommand('create class2');
        back.doCommand('addchild class2 class1 strong')
        expect(back.doCommand('print class1')).toContain('Class : class1 Parent : class2(strong)')
    });
    
    /* relationship parents (rp)*/
    it('.doCommand() can add a parent to a classBlock', function () {
        let back = new backEnd();
        back.doCommand('create class1');
        back.doCommand('create class2');
        expect(back.doCommand('addparent class1 class2 strong')).toContain('Added class2 as the parent for class1')
    });
    it('.doCommand() can get the parent of a classBlock', function () {
        let back = new backEnd();
        back.doCommand('create class1');
        back.doCommand('create class2');
        back.doCommand('addparent class1 class2 strong')
        expect(back.doCommand('getparent class1')).toContain('The parent of class1 is class2,strong.')
    });
    it('.doCommand() can remove the parent from a classblock', function () {
        let back = new backEnd();
        back.doCommand('create class1');
        back.doCommand('create class2');
        back.doCommand('addparent class1 class2 strong')
        expect(back.doCommand('removeparent class1')).toContain('Removed the parent of class1.')
    });

    /* relationship children (rc)*/
    it('.doCommand() can add a child to a classBlock', function () {
        let back = new backEnd()
        back.doCommand('create class1');
        back.doCommand('create class2');
        expect(back.doCommand('addchild class2 class1 strong')).toContain('added class1 as a child to class2.')
    });
    it('.doCommand() can get the children of a classBlock', function () {
        let back = new backEnd()
        back.doCommand('create class1');
        back.doCommand('create class2');
        back.doCommand('addchild class2 class1 strong')
        expect(back.doCommand('getparent class1')).toContain('The parent of class1 is class2,strong.')
    });
    it('.doCommand() can remove a child from a classblock', function () {
        let back = new backEnd()
        back.doCommand('create class1');
        back.doCommand('create class2');
        back.doCommand('addchild class2 class1 strong')
        expect(back.doCommand('deletechild class2 class1')).toContain("Removed class1 from the children's array of class2.")
    });
});

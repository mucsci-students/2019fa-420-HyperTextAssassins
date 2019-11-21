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

});

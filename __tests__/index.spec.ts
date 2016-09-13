import ReExportedKeyboard from './../src';
import Keyboard from './../src/Keyboard';
import * as ReExportedEverythingFromKeyboard from './../src';
import * as EverythingFromKeyboard from './../src/Keyboard';

describe('index', function () {
    it('should re-export everything from Keyboard.tsx', function () {
        expect(ReExportedEverythingFromKeyboard).toEqual(EverythingFromKeyboard);
    });

    it('should re-export default from Keyboard.tsx', function () {
        expect(ReExportedKeyboard).toBe(Keyboard);
    });
});
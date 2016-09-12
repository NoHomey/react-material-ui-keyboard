import {
    alphaNumericKeyboard,
    extendedKeyboard,
    numericKeyboard,
    kyeboardCapsLockLayout
} from './../src/layouts';

describe('layots', function () {
    describe('alphaNumericKeyboard', function () {
        it('is a keyboard layout containg only numbers and letters symbols, Excape, CapsLock, Backspace and Enter', function () {
            expect(alphaNumericKeyboard).toEqual([
                ['1',      '2',        '3', '4', '5', '6', '7', '8', '9',         '0'],
                ['q',      'w',        'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
                ['a',      's',        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
                ['Escape', 'CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm',     'Enter']
            ]);
        });
    });

    describe('extendedKeyboard', function () {
        it('is a keyboard layout extending alphaNumericKeyboard by adding second CapsLock, -, @, Spacebar and . keys', function () {
            expect(extendedKeyboard).toEqual([
                ['1',        '2', '3', '4', '5', '6', '7', '8', '9',         '0'],
                ['q',        'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
                ['a',        's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
                ['CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-',  'CapsLock'],
                ['Escape',   '@', '',         '     ',         '.',     'Enter']
            ]);
        });
    });

    describe('numericKeyboard', function () {
        it('is a keyboard layout for inputing numbers only', function () {
            expect(numericKeyboard).toEqual([
                    ['Escape', '-', 'Backspace'],
                    ['7',      '8',         '9'],
                    ['4',      '5',         '6'],
                    ['1',      '2',         '3'],
                    ['0',      '.',     'Enter']
            ]);
        });
    });

    describe('kyeboardCapsLockLayout', function () {
        describe('when second argument is true', function () {
             it('will upper case all keyboard layout keys which are not special keys (strings with lengh equal to 1)', function () {
                expect(kyeboardCapsLockLayout([
                    ['0', '9'],
                    ['a', 'z'],
                    ['а', 'я'],
                    ['Ю', 'F'],
                    ['@', '#'],
                    ['-', '+'],
                    ['S7s', 't3M'],
                    ['', '']
                ], true)).toEqual([
                    ['0', '9'],
                    ['A', 'Z'],
                    ['А', 'Я'],
                    ['Ю', 'F'],
                    ['@', '#'],
                    ['-', '+'],
                    ['S7s', 't3M'],
                    ['', '']
                ]);
            });

            it('will not upper case keyboard layout keys which are special keys (strings with lengh different from 1)', function () {
                expect(kyeboardCapsLockLayout([
                    ['Escape', 'Backspace'],
                    ['Enter', 'Alt'],
                    ['Shift', 'CapsLock'],
                    ['', 'iv'],
                    ['S7s', 't3M'],
                ], true)).toEqual([
                    ['Escape', 'Backspace'],
                    ['Enter', 'Alt'],
                    ['Shift', 'CapsLock'],
                    ['', 'iv'],
                    ['S7s', 't3M'],
                ]);
            });
        });

        describe('when second argument is false', function () {
            it('will lower case all keyboard layout keys which are not special keys (strings with lengh equal to 1)', function () {
                expect(kyeboardCapsLockLayout([
                    ['0', '9'],
                    ['A', 'Z'],
                    ['А', 'Я'],
                    ['ю', 'f'],
                    ['@', '#'],
                    ['-', '+'],
                    ['S7s', 't3M'],
                    ['', '']
                ], false)).toEqual([
                    ['0', '9'],
                    ['a', 'z'],
                    ['а', 'я'],
                    ['ю', 'f'],
                    ['@', '#'],
                    ['-', '+'],
                    ['S7s', 't3M'],
                    ['', '']
                ]);
            });

            it('will not lower case keyboard layout keys which are special keys (strings with lengh different from 1)', function () {
                expect(kyeboardCapsLockLayout([
                    ['Escape', 'Backspace'],
                    ['Enter', 'Alt'],
                    ['Shift', 'CapsLock'],
                    ['', 'iv']
                ], false)).toEqual([
                    ['Escape', 'Backspace'],
                    ['Enter', 'Alt'],
                    ['Shift', 'CapsLock'],
                    ['', 'iv']
                ]);
            });
        });
    });
});
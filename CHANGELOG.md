# Change log

## [v1.0.2](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/1.0.2)

### Key support

- Backspace
- Enter
- Escape
- CapsLock
- Keyboard (simulates Keyboard Layout Switcher)
- Any Single Char Key
- Spacing (Blank spot)

### Keyboard layouts

- Numeric Keyboard
- AlphaNumeric Keyboard

## [v1.1.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/1.1.0)

### Feutures

- Keyboard key's size (Can be changed by passing numbers to keyboardKeyWidth & keyboardKeyHeight Props)

## [v1.2.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/1.2.0)

### Feutures

- react-material-ui-keyboard can be used in none material-ui based projects (peerDependencie of material-ui is required)

### Key support

- Spacebar (Spacebar key width can be controlled by the number of spaces used for the key

### Keyboard layouts

- Extended Keyboard

## [v1.2.2](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/1.2.2)

### Feutures

- Can be used in TypeScript based projects: d.ts file is included (npm typings support)

## [v1.3.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/1.3.0)

### Feuters

- Add support for regular JavaScript users by including propTypes

### Keyboard layouts

- Numeric Keyboard now has `-` instead of blank space.

## [v1.4.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/1.4.0)

### Properties

- adding new prop `type` of type `'string' | 'number'` which adds support for `textField` which uses `value` of type `number`

## [v1.5.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/1.5.0)

### Deprecated

- prop `type` added in *v1.4.0* is deprecated due to it's probably never to be used as `'number'` `TextFieldInput` from material-ui v16.0 uses `value` of type `string` including for `<TextFieldInput type="number" />`

### Bug fixes

- fixing when inputs are `focus`ed and `blur`ed.

## [v2.0.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/2.0.0)

### Deprecated

- `Keyboard.id`

### Implementaion

- Switching from `id`s to `red`s
- exposing public methods `getTextField` & `getKeyboardField`
- using polyfilled `Object.assign` in from of `'object-assign'`

## [v2.0.1](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/2.0.1)

Example changes

## [v2.0.3](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/2.0.3)

### Bug fixes

- enusre Keyboard input field value is always in sync with `textField.props.value`

## [v3.0.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/3.0.0)

### Bug fixes

- Fix bug where changing keyboard key size via passing `keyboardKey*` `prop` changed current `muiTheme`

### Implementaion

- No logner using `context` to size keyboard key instead properties are passed directly to `KeyboardKey`

## [v3.0.1](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/3.0.1)

### Bug fixes

- Fix bug where `KeyboardKey` would not re-render if any of `prop`s introduced in `v3.0.0` changes due to using old version of `shouldComponentUpdate`

### Implementaion

- Droping inmplementation of `shouldComponentUpdate` for `KeyboardKey` 

## [v3.1.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/3.1.0)

### Feuters

- When `open` changes to `true` `Keyboard` will listen for `'keydown'` events on `window` and when `open` changes to `false` listener will be removed.

## [v3.1.1](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/3.1.1)

### Bug fixes

- Fix bug introduced with `v3.1.0` which wouldd call twice `_onKeyDown` if keyboard input field is focused due to listening both on `textField` clone and `window`

### Implementaion

- textField` clone no longer recives `onKeyDown` handler

## [v3.1.2](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/3.1.2)

### Bug fixes

- Fixing keyboard key caps locking which got broken in `v3.0.0`
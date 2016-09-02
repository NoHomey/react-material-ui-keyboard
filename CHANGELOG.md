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

- Keyboard key's size (Can be changed by passing numbers to `keyboardKeyWidth`, `keyboardKeyHeight` & `keyboardKeySymbolSize` props)

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

## [v3.1.3](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/3.1.3)

### Implementaion

- Replacing `List`s with plain old `div`s. `List` is a wrapper container build from `div` and just adds more overheap to `render`ing. It waas initially used in conjuction with `ListItem`, which is no longer used since `v2.0.0`

## [v4.0.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/4.0.0)

### Properties

- New prop `automatic` added. Which should remove the boilerplate of opening a keyboard when `textField.props.onFocus` is tiggered and closing it when `props.onRequestClose` is fired
- Props `open` and `onRequestClose` are now optional due to adding of the new `automatic` `prop`

## [v4.0.1](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/4.0.1)

Example updates

## [v4.1.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/4.1.0)

### Properties

- New prop `nativeVirtualKeyboard` added. Which controlls when to prevent the native vertual keyboard on `textField` by setting `readOnly`.

Note: `readOnly` is always `true` on the cloned `textField` used for input when keyboard is opened

Note: `readOnly` is setted to `true` on `textField` when `active` is also `true`

## [v4.1.1](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/4.1.1)

### Bug fixes

- Fixing a bug which falsely synced keyboard input value with `textField.props.value` each time a `componentWillReciveProps` is called. Now values are synced only when `textField.props.value` did really changed. Bug was introduced with `v2.0.3`

## [v5.0.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/5.0.0)

### New

- `Keyboard` now resizes on when `window` `'resize'`s
- `Keyboard` now fits on screen if calculated size based on `keyboardKeyWidth`, `keyboardKeyHeight` & `keyboardKeySymbolSize` `props`s is less than calculated
- `Keyboard` now exposes new `public` `static` member `automaitcOpenPredicate` which is `function` with signature: `function() => boolean` that is called when `automatic` is `true` and the attached `onFocus` handler on `textField` gets fired to determinate should keyboard `open` and disable native virtual keyboard by assigning `readOnly` at `textField` in the `render`. Default `automaitcOpenPredicate` behaviour is to always return `true`. You can override it to change when to `automatic`lly open keyboard `onFocus`

Chech for examples [GALLERY](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/GALLERY.md)

### Properties

- `onInput` is now optional

### Changes 

- `readOnly` is assigned to the result of invoking `Keyboard.automaitcOpenPredicate` on `textField` when `active` is`true`

## [v5.0.1](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/5.0.1)

### Bug fixes

- Fixing a bug which would set `Dialog` `dialogContentStyle` prop with `height`: `NaN` for custom `textFields` which dose not support `row` `prop`

## [v5.0.2](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/5.0.2)

### Bug fixes

- Fixing possible styling bugs due to wrapping `textFiled` and `Dialog` in `div`. If `style` `prop` is passed to `textFiled` it will be also passed and to the wrapping `div`
- Fixing possible styling bugs when `textFiled` is passed a `style` `prop` that would set any of `['minWidth', 'width', 'maxWidth', 'minHeight', 'height', 'maxHeight']`, those styling props are `delete`d on the cloned `textField`, used for keyboard input, in favour of unified user experiance of `fullWidth` `input`

## [v5.0.3](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/5.0.3)

### Bug fixes

- Fixing possible styling bugs when other than `style` `prop`s, such as `inputStyle`, `underlineStyle` or any other posible custom `prop`, is passed to `textField` would make keyboard input "style boken". `textField` `style` `prop` `properties` `['minHeight', 'height', 'maxHeight']` are no longer `delete`d
- Fixing possible styling bugs when `style` `prop` contains any of `['minHeight', 'height', 'maxHeight']` would prevent `Keyboard` from calculating it's height correctly

## [v6.0.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/6.0.0)

### Properties

#### New

- `correctionName` is a `string` which is the name of the cloned `textField` `prop` to which to bind `corrector`.
- `corrector` is a `function`  which is bound to the the cloned `textField` at `correctorName` `prop`. `this` is bound to the `Keyboard`, `public` method `makeCorrection` can be used to apply a correction to the keyboard input. 


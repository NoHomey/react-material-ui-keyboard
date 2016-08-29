# react-material-ui-keyboard

Virtual keyboard for TextFeild when needed.

You controll when to open it which allows cros platform App optimizations and code reusability for diferent platoforms such as Progressive Web Apps, Hybrid Apps, Electron Apps, Mobile Devices, Touch Devices, Desktops, and all other Compatible JavaScript Enviroments.

You have the freedom to choose on which of them to `open` the `Keyboard` and on which to just use a `TextField`!

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/textField.png)

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/show.png)

# Install

`npm install react-material-ui-keyboard`

# Changelog

**Check [Change log](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/CHANGELOG.md) for changes.**

# Properties

| Name                  | Type                   | Default                                      | Descriptio           |
| --------------------- | ---------------------- | -------------------------------------------- | -------------------- |
| automatic             | *bool*                 |                                              | If true, keyboard will automaticlly: open when textField gets focused and close instead of firing onRequestClose. |
| open                  | *bool*                 |                                              | Controls whether the Keyboard is opened or not. |
| nativeVirtualKeyboard | *bool*                 |                                              | If true and automatic is not true, the native virtual keyboard will not be prevented on textField. |
| layouts*              | *string[][][]*         |                                              | Keybaord layouts that can be changed when user clicks on 'Keyboard' key. |
| keyboardKeyWidth      | *number*               | *this.context.muiThemet.button.minWidth*     | Override keyboard key's max width. |
| keyboardKeyHeight     | *number*               | *this.context.muiThemet.button.height*       | Override keyboard key's max height. |
| keyboardKeySymbolSize | *number*               | *this.context.muiThemet.flatButton.fontSize* | Override keyboard key's max symbol size. |
| textField*            | *element*              |                                              | Input field used when keyboard is closed and cloned when it's opened.  |
| onRequestClose        | *function*             |                                              | Fired when keyboard recives 'Enter' or 'Escape' eighter from onKeyDown listener or keyboard key touch/click event. |
| onInput               | *function*             |                                              | Fired when keyboard recives 'Enter' **Signature:** `function(input: string) => void`. |

Props marked with \* are required.

# Requirements

## Node passed to `textField` Prop must support the following props:

- `value`\* of type `string`
- `onKeyDown`\* of type `function(event: React.KeyboardEvent)`
- `fullWidth` of type `bool`
- `readOnly`\* of type `bool`

Props marked with \* must be passed down to the native `input` element.

## And to implement method `getInputNode` which returns `input` `ref`.

# Implementation

react-material-ui-keyboard is implemented using the followong Material-Ui Elements

- Dialog
- FlatButtton
- SVG Icons

and uses `React.cloneElement` to clone `textFiled` for the kyboard input field.

The used `Dialog` is `modal` which guaranties that only one keyboard can be opened which allows memory and performance optimizations. 

`Keyboard` Compoment uses `MuiTheme`, `props`, `window.innerWidth` and `window.innerHeight` information to calculate it's size and keyboard keys size (width x height) to ensure it always fits best on screen chech [GALLERY](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/GALLERY.md).

# Key Support

For supported keys read [KEYSUPPORT](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/KEYSUPPORT.md)

# Included Layouts

## Numeric Keyboard

```js 
const NumericKeyboard = [
    ['Escape', '-', 'Backspace'],
    ['7',      '8',         '9'],
    ['4',      '5',         '6'],
    ['1',      '2',         '3'],
    ['0',      '.',     'Enter']
];
```

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/numeric.png)

## AlphaNumeric Keyboard

```js
const AlphaNumericKeyboard = [
    ['1',      '2',        '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',      'w',        'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',      's',        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['Escape', 'CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm',     'Enter']
];
```

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/alphanumeric.png)

### With CapsLock On

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/capsed.png)

## Extended Keyboard

```js
const ExtendedKeyboard = [
    ['1',        '2', '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',        'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',        's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-',  'CapsLock'],
    ['Escape',   '@', '_',         '     ',         '.',     'Enter']
];
```
### Demonstrating Spacebar and keyboard key size feuters

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/extended.png)

# Creating Custom Keyboard Layout

- All single chars suppoted as String can be used as a symbol key!
- Empty strings can be used for blank spaces
- Use `KeyboardEvent.key` names for all [Special keys] (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
- Use `'Keyboard'` for key with which user can change keyboard layout 

**All spacial keys (none Symbol will have an Icon and support at some point*)**

**Check supported keys!**

**If a key you want to use is not supported open an Issue.**

# Public methods

`Keyboard` exposes two `public` methods: `getTextField` and `getKeyboardField` with common signature `function() => TextField`. Which both return React `ref`s for passted `textField` and cloned one for the keyboard input. `TextField` is used as common return type because of the requirement of `getInputNode` for getting a `input` `ref` which of v0.16 of material-ui will be replaced with requirement of public member `input`.

# Example

```js
import * as React from 'react';
import TextField from 'material-ui/TextField';
import { Keyboard, AlphaNumericKeyboard } from 'react-material-ui-keyboard';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: ''
        };
        this._onInput = this._handleInput.bind(this);
    }

    _handleInput(input) {
        this.setState({ value: input });
    }
    
    render() {
      <Keyboard
        textField={
          <TextField
            id="text"
            value={this.state.value}
          />
        }
        automatic
        onInput={this._onInput}
        layouts={[AlphaNumericKeyboard]}
      />;
    }
};
```

# Example using custom textField and controlling when to open the keyboard and when to prevent the native virtual keyboard

```js
import * as React from 'react';
import NumberInput from 'material-ui-number-input';
import { Keyboard, NumericKeyboard } from 'react-material-ui-keyboard';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, value: '2' };
        this._onFocus = this._handleFocus.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onRequestClose = this._handleRequestClose.bind(this);
        this._onInput = this._handleInput.bind(this);
        this._onError = this._handleError.bind(this);
        this._onValid = this._handleValid.bind(this);
    }
    
    _canOpenKeyboard() {
        return (this.state.value.length % 2) === 0;
    }

    _handleFocus(event) {
        if(this._canOpenKeyboard()) {
            this.setState({ open: true });
        }
    }
    
    _handleChange(event, value) {
        console.log(value);
        this.setState({ value: value });
    }
    
    _handleRequestClose() {
        this.setState({ open: false });
    }
    
    _handleInput(input) {
        console.log(input);
        this.setState({ value: input });
    }
    
    _handleError(error) {
        let errorText;
        switch (error) {
            case 'required':
                errorText = 'This field is required';
                break;
            case 'invalidSymbol':
                errorText = 'You are tring to enter none number symbol';
                break;
            case 'incompleteNumber':
                errorText = 'Number is incomplete';
                break;
            case 'singleMinus':
                errorText = 'Minus can be use only for negativity';
                break;
            case 'singleFloatingPoint':
                errorText = 'There is already a floating point';
                break;
            case 'singleZero':
                errorText = 'Floating point is expected';
                break;
            case 'min':
                errorText = 'You are tring to enter number less than -10';
                break;
            case 'max':
                errorText = 'You are tring to enter number greater than 12';
                break;
        }
        this.setState({ errorText: errorText });
    }
    
    _handleValid(value) {
        console.debug(`valid ${value}`);
    }

    componentDidMount() {
        setTimeout(() => this.setState({ value: '89' }), 1000);
    }
    
    render() {
        const { state, _onFocus, _onChange, _onError, _onValid } = this;
        const { value, errorText } = state;
        const textField = (
            <NumberInput
                id="num"
                required
                value={value}
                min={-10}
                max={12}
                strategy="warn"
                errorText={errorText}
                onFocus={_onFocus}
                onChange={_onChange}
                onError={_onError}
                onValid={_onValid}
                floatingLabelText="Click for a Keyboard" />
        );

        return (
            <Keyboard
                nativeVirtualKeyboard={!this._canOpenKeyboard()}
                textField={textField}
                open={this.state.open}
                onRequestClose={this._onRequestClose}
                onInput={this._onInput}
                layouts={[NumericKeyboard]}
                keyboardKeyHeight={50}
                keyboardKeyWidth={100}
                keyboardKeySymbolSize={36}
            />
        );
    }
}
```

# Written in Typescript and Typescript Ready! ([check examples](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/example))

# Supports propTypes for regular JavaScript users

# It is possible to use react-material-ui-keyboard in none material-ui project.

## Limitations

If you need to change theme eg. gutter, spacing, colors or any other option you need to wrapp ```<Keyboard ... />``` in ```MuiThemeProvider``` or to manually provide a ```muiTheme``` to parent's ```context```.

# Testing

## Tests will be added soon

# Contributing

1. Fork the repository
2. `npm install`
3. `npm run typings`
4. Make changes
5. `npm start`
6. open [localhost:3000](http://localhost:3000)
7. Make a Pull Request
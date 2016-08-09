# react-material-ui-keyboard

Virtual keyboard for TextFeild when needed.

You controll when to open it which allows cros platform App optimizations and code reusability for diferent platoforms such as Progressive Web Apps, Hybrid Apps, Electron Apps, Mobile Devices, Touch Devices, Desktops, and all other Compatible JavaScript Enviroments.

You have the freedom to choose on which of them to ```open``` the ```Keyboard``` and on which to just use a ```TextField```!

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/textField.png)

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/show.png)

# Install

```npm install react-material-ui-keyboard```

# Usage

```js
KeyboardProps {
    textField: React.ReactNode // TextField or Component inheriting the following TextField Props: id, value, onKeyDown, fullWidth, onFocus, onChange;
    open: boolean // show keyboard or provided textField;
    onRequestClose: RequestCloseHandler // function(): void;
    onInput: InputHandler // function(input: string): void;
    layout: Array<KeyboardLayout>; // Array<Array<Array<string>>>;
    keyboardKeyWidth?: number; // Optinal Keyboard Key Width
    keyboardKeyHeight?: number; // Optinal Keyboard Key Height
    keyboardKeySymbolSize?: number; // Optinal Keyboard Key Symbol Size (fontSize for single char Symbols and svg Size as of size x size for Special Keys
};

// ...
<Keyboard
  textField={
    <TextField
      id="text"
      value={this.state.value}
      onFocus={this._onFocus}
      onChange={this._onChange} />
  }
  open={this.state.open}
  onRequestClose={this._onRequestClose}
  onInput={this._onInput}
  layout={[AlphaNumericKeyboard]}
  keyboardKeyHeight={50}
  keyboardKeyWidth={100}
  keyboardKeySymbolSize={36}
/>        
```
# Requirements

- textField must be Controlled Element
- textField must atleast have pointed Props
- muiTheme must be passed down to the Context
- textFiled must have id or name if it is an input

# Implementation

react-material-ui-keyboard is implemented using the followong Material-Ui Elements

- Dialog
- FlatButtton
- SVG Icons
- List
- ListItem (as SimpleListItem)

and uses ```React.cloneElement``` to clone ```textFiled``` to show keybaord input.

The used ```Dialog``` is ```modal``` which guartes that only one keyboard can be opened which allows memory and performance optimizations. 

Keyboard Compoment uses MuiTheme information to calculate it's width.

# Key Support

For supported keys read [KEYSUPPORT](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/KEYSUPPORT.md)

# Included Layouts

## Numeric Keyboard

```js 
const NumericKeyboard = [
    ['Escape', '', 'Backspace'],
    ['7',      '8',        '9'],
    ['4',      '5',        '6'],
    ['1',      '2',        '3'],
    ['0',      '.',    'Enter']
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

## All single chars suppoted as String can be used as a symbol key!

## Empty strings can be used for spaces

## The only requirement is to use KeyboardEvent.key names for all Special keys (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

## All spacial keys (none Symbol will have an Icon and support at some point)

## Check supported keys!

## If a key you want to use is not supported create an Issue.

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
        this._onFocus = this._handleFocus.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onRequestClose = this._handleRequestClose.bind(this);
        this._onInput = this._handleInput.bind(this);
    }
    
    _handleFocus(event) {
        this.setState({ open: true });
    }
    
    _handleChange(event) {
        const textEnterEvent = event;
        const value = textEnterEvent.target.value;
        this.setState({ value: value });
    }
    
    _handleRequestClose() {
        this.setState({ open: false });
    }
    
    _handleInput(input) {
        this.setState({ value: input });
    }
    
    shouldComponentUpdate(props, state) {
        return (this.state.open !== state.open) || (this.state.value !== state.value);
    }
    
    render() {
      <Keyboard
        textField={
          <TextField
            id="text"
            value={this.state.value}
            onFocus={this._onFocus}
            onChange={this._onChange} />
        }
        open={this.state.open}
        onRequestClose={this._onRequestClose}
        onInput={this._onInput}
        layout={[AlphaNumericKeyboard]}
      />;
    }
};
```

# Written in Typescript and Typescript Ready! ([check example](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/example/index.tsx))

# It is possible to use react-material-ui-keyboard in none material-ui project.

## Limitations

If you need to change theme eg. gutter, spacing, colors or any other option you need to wrapp ```<Keyboard ... />``` in ```MuiThemeProvider``` or to manually provide a ```muiTheme``` to parent's ```context```.

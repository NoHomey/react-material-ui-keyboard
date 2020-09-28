# react-material-ui-keyboard

**The project is now archived since it requires a complete rewrite with modern day React and Material-UI!**

Virtual keyboard for TextField when needed.

[![npm version](https://badge.fury.io/js/react-material-ui-keyboard.svg)](https://badge.fury.io/js/react-material-ui-keyboard)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/NoHomey/react-material-ui-keyboard)
[![Build Status](https://semaphoreci.com/api/v1/nohomey/react-material-ui-keyboard/branches/master/badge.svg)](https://semaphoreci.com/nohomey/react-material-ui-keyboard)
[![Code Climate](https://codeclimate.com/github/NoHomey/react-material-ui-keyboard/badges/gpa.svg)](https://codeclimate.com/github/NoHomey/react-material-ui-keyboard)
[![Test Coverage](https://codeclimate.com/github/NoHomey/react-material-ui-keyboard/badges/coverage.svg)](https://codeclimate.com/github/NoHomey/react-material-ui-keyboard/coverage)
[![Issue Count](https://codeclimate.com/github/NoHomey/react-material-ui-keyboard/badges/issue_count.svg)](https://codeclimate.com/github/NoHomey/react-material-ui-keyboard)
![TypeScript](https://img.shields.io/badge/%3C%20%2F%3E-TypeScript-blue.svg)
![Typings](https://img.shields.io/badge/typings-%E2%9C%93-brightgreen.svg)

You controll when to open it which allows cross platform App optimizations and code reusability for diferent platoforms such as Progressive Web Apps, Hybrid Apps, Electron Apps, Touch Devices, Smart TVs, Desktops, and all other Compatible JavaScript Enviroments.

You have the freedom to choose on which of them to `open` the `Keyboard` and on which to just use a `textField`!

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/textField.png)

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/show.png)

# Install

Install with npm:

```bash
$ npm install react-material-ui-keyboard
```

[![NPM](https://nodei.co/npm/react-material-ui-keyboard.png?downloads=true&stars=true)](https://nodei.co/npm/react-material-ui-keyboard/)

# Changelog

**Check [Change log](https://github.com/NoHomey/react-material-ui-keyboard/blob/master/CHANGELOG.md) for changes.**

# Properties

| Name                  | Type           | Default                                      | Description          |
| --------------------- | ---------------| -------------------------------------------- | -------------------- |
| automatic             | *bool*         |                                              | If true, keyboard will automaticlly: open when textField gets focused and close instead of firing onRequestClose. |
| disableEffects        | *bool*         |                                              | If true, disables all effects (ripples, focus, hover) on all `keyboardKey`s |
| open                  | *bool*         |                                              | Controls whether the Keyboard is opened or not. |
| layouts*              | *string[][][]* |                                              | Keybaord layouts that can be changed when user clicks on 'Keyboard' key. |
| keyboardKeyWidth      | *number*       | *this.context.muiThemet.button.minWidth*     | Override keyboard key's max width. |
| keyboardKeyHeight     | *number*       | *this.context.muiThemet.button.height*       | Override keyboard key's max height. |
| keyboardKeySymbolSize | *number*       | *this.context.muiThemet.flatButton.fontSize* | Override keyboard key's max symbol size. |
| textField*            | *element*      |                                              | Input field used when keyboard is closed and cloned when it's opened.  |
| onRequestClose        | *function*     |                                              | Fired when keyboard recives 'Enter' or 'Escape' eighter from onKeyDown listener or keyboard key touch/click event. |
| onInput               | *function*     |                                              | Fired when keyboard recives 'Enter' **Signature:** `function(input: string) => void`. |
| onInputValueChange    | *function*     |                                              | Fired when keyboard's input chages value **Signature:** `function(input: string) => void`. |
| correctorName         | *string*       |                                              | Name of the cloned textField prop to which to bind corrector. |
| corrector**           | *function*     |                                              | Function which is bound to the the cloned textField at correctorName prop. this is bound to the Keyboard, public method makeCorrection can be used to apply a correction to the keyboard input. |                                                 

Props marked with \* are required.

\*\* corrector is required when correctorName is provided.

# Requirements

## `textField` must be a controlled input

## Node passed to `textField` Prop must support the following props:

- `value`\* of type `string`
- `readOnly`\* of type `bool`

Props marked with \* must be passed down to the native `input` element.

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

The following keyboard layouts are exported from `'react-material-ui-keyboard/layouts'`

## numericKeyboard

```js 
const numericKeyboard = [
    ['Escape', '-', 'Backspace'],
    ['7',      '8',         '9'],
    ['4',      '5',         '6'],
    ['1',      '2',         '3'],
    ['0',      '.',     'Enter']
];
```

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/numeric.png)

## alphaNumericKeyboard

```js
const alphaNumericKeyboard = [
    ['1',      '2',        '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',      'w',        'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',      's',        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['Escape', 'CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm',     'Enter']
];
```

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/alphanumeric.png)

### With CapsLock On

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/capsed.png)

## extendedKeyboard

```js
const extendedKeyboard = [
    ['1',        '2', '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',        'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',        's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-',  'CapsLock'],
    ['Escape',   '@', '#',         '     ',         '.',     'Enter']
];
```
### Demonstrating Spacebar and keyboard key size futers

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

`Keyboard` exposes `public` method `makeCorrection` which can be used to apply keyboard input value corrections when keyboard is opened or within `correction` handller.

# Public members

`Keyboard` has one `public` `static` member which is designed to be overwritten: `automaitcOpenPredicate` it's signature is `function() => boolean`. It is  called when `automatic` is `true` and the attached `onFocus` handler on `textField` gets fired to determinate should keyboard `open` and disable the native virtual keyboard by assigning `readOnly` at `textField` in the `render`. Default `automaitcOpenPredicate` behaviour is to always return `true`. You can override it to change when to `automatic`lly open keyboard `onFocus`.

# Examples

```js
import * as React from 'react';
import TextField from 'material-ui/TextField';
import Keyboard from 'react-material-ui-keyboard';
import { extendedKeyboard } from 'react-material-ui-keyboard/layouts';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: ''
        };
        this.onInput = this.handleInput.bind(this);
    }

    handleInput(input) {
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
        onInput={this.onInput}
        layouts={[extendedKeyboard]}
      />;
    }
};
```

# Example using custom textField and controlling when to open the keyboard and when to prevent the native virtual keyboard

```js
import * as React from 'react';
import NumberInput from 'material-ui-number-input';
import Keyboard from 'react-material-ui-keyboard';
import { numericKeyboard } from 'react-material-ui-keyboard/layouts';

function corrector(value) {
    console.log(`correction ${value}`);
    this.makeCorrection(value);
}

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, value: '2' };
        this.onFocus = this.handleFocus.bind(this);
        this.onChange = this.handleChange.bind(this);
        this.onRequestClose = this.handleRequestClose.bind(this);
        this.onInput = this.handleInput.bind(this);
        this.onError = this.handleError.bind(this);
        this.onValid = this.handleValid.bind(this);
    }
    
    canOpenKeyboard() {
        return (this.state.value.length % 2) === 0;
    }

    handleFocus(event) {
        if(this.canOpenKeyboard()) {
            this.setState({ open: true });
        }
    }
    
    handleChange(event, value) {
        console.log(value);
        this.setState({ value: value });
    }
    
    handleRequestClose() {
        this.setState({ open: false });
    }
    
    handleInput(input) {
        console.log(input);
        this.setState({ value: input });
    }
    
    handleError(error) {
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
    
    handleValid(value) {
        console.debug(`valid ${value}`);
    }

    componentDidMount() {
        setTimeout(() => this.setState({ value: '89' }), 1000);
    }
    
    render() {
        const { state, onFocus, onChange, onError, onValid, onInput } = this;
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
                onFocus={onFocus}
                onChange={onChange}
                onError={onError}
                onValid={onValid}
                floatingLabelText="Click for a Keyboard" />
        );

        return (
            <Keyboard
                textField={textField}
                open={this.state.open}
                onRequestClose={this.onRequestClose}
                onInput={onInput}
                correctorName="onRequestValue"
                corrector={corrector}
                layouts={[numericKeyboard]}
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

1. `npm install`

2. `npm test`

# Contributing

1. `npm install`

2. Make changes

3. If necessary add some tests to `__tests__`

4. `npm test`

5. Make a Pull Request

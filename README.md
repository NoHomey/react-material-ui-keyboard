# react-material-ui-keyboard

Virtual keyboard for TextFeild when needed

# Install

```npm install react-material-ui-keyboard```

# Usage

```tsx
KeyboardProps {
    textField: React.ReactNode // TextField or Component inheriting the following TextField Props: id, value, onKeyDown, fullWidth, onFocus, onChange;
    open: boolean // show keyboard or provided textField;
    onRequestClose: RequestCloseHandler // function(): void;
    onInput: InputHandler // function(input: string): void;
    layout: Array<KeyboardLayout>; // Array<Array<Array<string>>>;
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
/>        
```

# Key Support (as of v1.0.2)

- Backspace
- Enter
- Escape
- CapsLock
- Keyboard (simulates Keyboard Layout Switcher)
- Any Single Char Key
- Spacing (Blank spot)

# Included Layouts (as of v1.0.2)

## Numeric Keyboard

```js
const NumericKeyboard = [
    ['Escape', '', 'Backspace'],
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'Enter']
];
```

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/numeric.png)

## AlphaNumeric Keyboard

```js
const AlphaNumericKeyboard = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['Escape', 'CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter']
];
```

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/alphanumeric.png)

## CapsedAlphaNumeric Keyboard

```js
const CapsedAlphaNumbericKeyboard = KyeboardCapsLock(AlphaNumericKeyboard, true);
```

![Screenshot](https://raw.githubusercontent.com/NoHomey/react-material-ui-keyboard/master/screenshots/capsed.png)

# Creating Custom Keyboard Layout

## All single chars suppoted as String can be used as a symbol key!

## Empty strings can be used for spaces

## The only requirement is to use KeyboardEvent.key names for all Special keys (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

## All spacial keys (none Symbol will have an Icon and support at some point! 

## Check supported keys!

## If a key you wnat to use is not supported create an Issue.

# Example

```jsx
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

# Typescript Ready

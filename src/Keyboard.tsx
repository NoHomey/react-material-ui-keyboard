import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { KeyboardKey, KeyboardKeyProps } from './KeyboardKey';
import { MuiTheme } from 'material-ui/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ObjectAssign = require('object-assign');

const { div } = React.DOM;

export const AlphaNumericKeyboard: KeyboardLayout = [
    ['1',      '2',        '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',      'w',        'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',      's',        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['Escape', 'CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm',     'Enter']
];

export const ExtendedKeyboard: KeyboardLayout = [
    ['1',        '2', '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',        'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',        's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-',  'CapsLock'],
    ['Escape',   '@', '_',         '     ',         '.',     'Enter']
];

export const NumericKeyboard: KeyboardLayout = [
    ['Escape', '-', 'Backspace'],
    ['7',      '8',         '9'],
    ['4',      '5',         '6'],
    ['1',      '2',         '3'],
    ['0',      '.',     'Enter']
];

export type KeyboardLayout = Array<Array<string>>;

export function KyeboardCapsLock(layout: KeyboardLayout, caps: boolean): KeyboardLayout {
    return layout.map((row: Array<string>): Array<string> => {
        return row.map((key: string): string => {
            return (key.length === 1) ? (caps ? key.toUpperCase() : key.toLowerCase()) : key;
        }); 
    });
}

export type InputValue = string | number;

export type RequestCloseHandler = () => void;

export type InputHandler = (input: InputValue) => void;

export type TextFieldRef = (componet: TextField) => void;

export interface TextFieldRequiredProps {
    value: string; 
    onKeyDown: React.KeyboardEventHandler;
    fullWidth: boolean;
    ref?: TextFieldRef;
}

export type TextFieldElement = React.ReactElement<TextFieldRequiredProps>;

export interface KeyboardProps {
    open: boolean;
    layouts: Array<KeyboardLayout>;
    keyboardKeyWidth?: number;
    keyboardKeyHeight?: number;
    keyboardKeySymbolSize?: number;
    textField: TextFieldElement;
    onRequestClose: RequestCloseHandler;
    onInput: InputHandler;
};

export interface KeyboardState {
    value?: string;
    layout?: number;
    capsLock?: boolean;
};

export interface KeyboardContext {
    muiTheme?: MuiTheme;
};

export type KeyboardWindowEventListener = (event: FocusEvent | KeyboardEvent) => void;

export type NativeKeyboardEventHandler = (event: KeyboardEvent) => void;

export class Keyboard extends React.Component<KeyboardProps, KeyboardState> {
    private static _addListener(event: string, listener: KeyboardWindowEventListener): void {
        window.addEventListener(event, listener, true);
    }

    private static _removeListener(event: string, listener: KeyboardWindowEventListener): void {
         window.removeEventListener(event, listener, true);
    }

    public static getSupportedSpecialKeys(): Array<string> {
        return ['Enter', 'Backspace', 'Escape', 'CapsLock', 'Keyboard'];
    }

    public static propTypes: Object = {
        open: React.PropTypes.bool.isRequired,
        layouts: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string))).isRequired,
        keyboardKeyWidth: React.PropTypes.number,
        keyboardKeyHeight: React.PropTypes.number,
        keyboardKeySymbolSize: React.PropTypes.number,
        textField: React.PropTypes.element.isRequired,
        onRequestClose: React.PropTypes.func.isRequired,
        onInput: React.PropTypes.func.isRequired
    };
    public static contextTypes: Object = { muiTheme: React.PropTypes.object };
    public context: KeyboardContext;
    private _textField: TextField;
    private _refTextField: TextFieldRef;
    private _refKeyboardField: TextFieldRef;
    private _keyboardField: TextField;
    private _onKeyboard: (key: string) => void;
    private _onKeyDown: NativeKeyboardEventHandler;
    private _preventEvent: (event: FocusEvent) => void;

    private _setValue(value: string): void {
        this.setState({ value: value });
    }

    private _syncValue(value: string): void {
        if(value !== this.state.value) {
            this._setValue(value);
        }
    }

    private _addPreventListener(event: string): void {
        Keyboard._addListener(event, this._preventEvent);
    }

    private _removePreventListener(event: string): void {
        Keyboard._removeListener(event, this._preventEvent);
    }

    private _actionKeyDownListener(actioner: (event: string, listener: NativeKeyboardEventHandler) => void): void {
        actioner('keydown', this._onKeyDown);
    }

    private _handleEvent(event: FocusEvent): void {
        if(event.target === this._textField.getInputNode()) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }

    private _handleKeyboard(key: string): void {
        const { props, state } = this;
        const { onInput, layouts: propsLayout, onRequestClose } = props;
        const { value, capsLock, layout: stateLayout } = state;
        switch(key) {
            case 'Enter': {
                onInput(value);
                onRequestClose();
                break;
            }
            case 'Backspace': {
                this._setValue(value.substring(0, value.length - 1));
                break;
            }
            case 'Escape': {
                onRequestClose();
                break;
            }
            case 'CapsLock': {
                this.setState({ capsLock: !capsLock });
                break;
            }
            case 'Keyboard': {
                const layout: number = stateLayout;
                this.setState({ layout: (layout === propsLayout.length - 1) ? 0 : layout + 1 });
            }
            default: {
                if(key.match(/^\ +$/)) {
                    key = ' ';
                }
                this._setValue(value + key);
            }
        }
    }

    private _handleKeyDown(event: KeyboardEvent): void {
        const { key } = event;
        event.stopImmediatePropagation();
        if((Keyboard.getSupportedSpecialKeys().indexOf(key) !== -1) || (key.match(/^(\ +|.)$/))) {
            event.preventDefault();
            this._handleKeyboard(key);
        }
    }

    private _handleTextField(component: TextField): void {
        this._textField = component;
    }

    private _handleKeyboardField(component: TextField): void {
        this._keyboardField = component;
        if(component !== null) {
            component.getInputNode().focus();
        }
    }

    public getTextField(): TextField {
        return this._textField;
    }

    public getKeyboardField(): TextField {
        return this._keyboardField;
    }

    public constructor(props: KeyboardProps, context: KeyboardContext) {
        super(props, context);
        this.state = {
            value: '',
            layout: 0,
            capsLock: false
        };
        this.context = context;
        this._refTextField = this._handleTextField.bind(this);
        this._refKeyboardField = this._handleKeyboardField.bind(this);
        this._onKeyboard = this._handleKeyboard.bind(this);
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._preventEvent = this._handleEvent.bind(this);
    }

    public componentDidMount(): void {
        this._syncValue(this.getTextField().getInputNode().value);
    }

    public componentWillReceiveProps(props: KeyboardProps): void {
        this._syncValue(props.textField.props.value);
    }

    public componentDidUpdate(props: KeyboardProps, state: KeyboardState): void {
        const { open } = this.props;
        const { open: prev } = props;
        if(open !== prev) {
            if(open) {
                this._addPreventListener('focus');
                this._addPreventListener('blur');
                this._actionKeyDownListener(Keyboard._addListener);
            } else {
                this._textField.getInputNode().focus();
                this._removePreventListener('focus');
                this._removePreventListener('blur');
                this._actionKeyDownListener(Keyboard._removeListener);
                this._textField.getInputNode().blur();
            }
        }
    }

    public render(): JSX.Element {
        const { props, state, context, _refTextField, _refKeyboardField } = this;
        const { textField, layouts, keyboardKeyHeight, keyboardKeyWidth, keyboardKeySymbolSize, open  } = props;
        const { value, layout: stateLayout, capsLock } = state;
        const { muiTheme} = context;
        const textFieldElement: TextFieldElement = textField;
        let textFieldProps: any = ObjectAssign({}, textFieldElement.props);
        ['onChange', 'onFocus', 'onBlur', 'onKey', 'onKeyUp', 'onKeyDown', 'onKeyPress'].forEach((prop: string): void => {
            if(textFieldProps.hasOwnProperty(prop)) {
                textFieldProps[prop] = undefined;
            }
        });
        ObjectAssign(textFieldProps, {
            value: value, 
            fullWidth: true,
            ref: _refKeyboardField
        });
        const keyboardTextField: TextFieldElement = React.cloneElement(textFieldElement, textFieldProps);
        const inputTextFieldProps: any = ObjectAssign({}, textFieldElement.props, { ref: _refTextField });
        const inputTextField: TextFieldElement = React.cloneElement(textFieldElement, inputTextFieldProps);
        const keyboardLayout: KeyboardLayout = KyeboardCapsLock(layouts[stateLayout], capsLock);
        const theme: MuiTheme = muiTheme ? muiTheme : getMuiTheme();
        const keyHeight: number = keyboardKeyHeight !== undefined ? keyboardKeyHeight : theme.button.height;
        const keyWidth: number = keyboardKeyWidth !== undefined ? keyboardKeyWidth : theme.button.minWidth;
        const keySymbolSize: number = keyboardKeySymbolSize !== undefined ? keyboardKeySymbolSize : theme.flatButton.fontSize;
        let keyboardRowLengths: Array<number> = [];
        const keyboardRows: Array<React.ReactElement<void>> = keyboardLayout.map((row: Array<string>, rowIndex: number): React.ReactElement<void> => {
            let spacebar: number = 1;
            const keyboardRowKeys: Array<React.ReactElement<KeyboardKeyProps>> = row.map((key: string, keyIndex: number): React.ReactElement<KeyboardKeyProps> => {
                if(key.match(/^\ +$/)) {
                    spacebar = key.length;
                }
                return (
                    <KeyboardKey
                        keyboardKey={key}
                        key={Number(`${rowIndex}.${keyIndex}`)}
                        onKeyPress={this._onKeyboard}
                        keyboardKeyHeight={keyHeight}
                        keyboardKeyWidth={keyWidth}
                        keyboardKeySymbolSize={keySymbolSize}
                    />
                );
            });
            keyboardRowLengths.push(row.length + spacebar - 1);
            return <div key={rowIndex}>{keyboardRowKeys}</div>;
        });

        const maxKeyboardRowLength: number = Math.max(...keyboardRowLengths);
        const dialogWidth: number = (maxKeyboardRowLength * keyWidth) + (2 * theme.baseTheme.spacing.desktopGutter);
        const dialogcontentStyle: React.CSSProperties = { width: dialogWidth, maxWidth: 'none' };
        const keyboard: JSX.Element = (
            <div>
                {inputTextField}
                <Dialog open={open} modal={true} contentStyle={dialogcontentStyle} autoScrollBodyContent={true}>
                    <div>
                        <div>
                            {keyboardTextField}
                        </div>
                        <div>
                            <div>
                                {keyboardRows}
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
        return muiTheme ? keyboard : <MuiThemeProvider>{keyboard}</MuiThemeProvider>;
    } 
};

export default Keyboard;
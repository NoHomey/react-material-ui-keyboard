import * as React from 'react';
import bind from 'bind-decorator';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { KeyboardKey, KeyboardKeyProps } from './KeyboardKey';
import { MuiTheme } from 'material-ui/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import objectAssign = require('object-assign');
import deepEqual = require('deep-equal');

const { div } = React.DOM;

export const alphaNumericKeyboard: KeyboardLayout = [
    ['1',      '2',        '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',      'w',        'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',      's',        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['Escape', 'CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm',     'Enter']
];

export const extendedKeyboard: KeyboardLayout = [
    ['1',        '2', '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',        'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',        's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-',  'CapsLock'],
    ['Escape',   '@', '',         '     ',         '.',     'Enter']
];

export const numericKeyboard: KeyboardLayout = [
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

export type RequestCloseHandler = () => void;

export type InputHandler = (input: string) => void;

export type TextFieldRef = (componet: TextField) => void;

export interface TextFieldRequiredProps {
    style?: React.CSSProperties;
    readOnly: boolean;
    value: string; 
    onKeyDown: React.KeyboardEventHandler;
}

export interface TextFieldAccessedProps extends TextFieldRequiredProps {
    onFocus?: React.FocusEventHandler;
    ref?: TextFieldRef;
    rows?: number;
    floatingLabelText?: string;
}

export type TextFieldElement = React.ReactElement<TextFieldRequiredProps>;

export type KeyboardRow = React.ReactElement<void>;

export type KeyboardRowKey = React.ReactElement<KeyboardKeyProps>;

export interface KeyboardProps {
    open?: boolean;
    automatic?: boolean;
    nativeVirtualKeyboard?: boolean;
    layouts: Array<KeyboardLayout>;
    keyboardKeyWidth?: number;
    keyboardKeyHeight?: number;
    keyboardKeySymbolSize?: number;
    textField: TextFieldElement;
    onRequestClose?: RequestCloseHandler;
    onInput?: InputHandler;
    correctorName?: string;
    corrector?: Function;
}

export interface KeyboardState {
    value?: string;
    layout?: number;
    capsLock?: boolean;
    open?: boolean;
};

export interface KeyboardContext {
    muiTheme?: MuiTheme;
}

export type KeyboardWindowEventListener = (event: FocusEvent | KeyboardEvent) => void;

export type NativeKeyboardEventHandler = (event: KeyboardEvent) => void;

export type AutomaitcOpenPredicate = () => boolean;

function allwaysTruePredicate(): boolean {
    return true;
}

export class Keyboard extends React.Component<KeyboardProps, KeyboardState> {
    private static calculatedTextFieldHeight(props: TextFieldAccessedProps): number {
        const { rows, floatingLabelText } = props;
        return (rows ? ((rows - 1) * 24) : 0) + (floatingLabelText ? 72 : 48);
    }

    private static addListener(event: string, listener: KeyboardWindowEventListener): void {
        window.addEventListener(event, listener, true);
    }

    private static removeListener(event: string, listener: KeyboardWindowEventListener): void {
         window.removeEventListener(event, listener, true);
    }

    public static getSupportedSpecialKeys(): Array<string> {
        return Keyboard.supportedSpecialKeys;
    }

    private static supportedSpecialKeys: Array<string> = ['Enter', 'Backspace', 'Escape', 'CapsLock', 'Keyboard'];;
    private static noStyleHeight: React.CSSProperties = {
        minHeight: 0,
        height: 0,
        maxHeight: 0
    };
    public static propTypes: React.ValidationMap<KeyboardProps> = {
        nativeVirtualKeyboard: React.PropTypes.bool,
        open: React.PropTypes.bool,
        automatic: React.PropTypes.bool,
        layouts: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string))).isRequired,
        keyboardKeyWidth: React.PropTypes.number,
        keyboardKeyHeight: React.PropTypes.number,
        keyboardKeySymbolSize: React.PropTypes.number,
        textField: React.PropTypes.element.isRequired,
        onRequestClose: React.PropTypes.func,
        onInput: React.PropTypes.func,
        correctorName: React.PropTypes.string,
        corrector:  React.PropTypes.func
    };
    public static contextTypes: Object = { muiTheme: React.PropTypes.object };
    public static automaitcOpenPredicate: AutomaitcOpenPredicate = allwaysTruePredicate;
    public context: KeyboardContext;
    private textField: TextField;
    private keyboardField: TextField;

    private setValue(value: string): void {
        this.setState({ value: value });
    }

    private syncValue(value: string): void {
        if(value !== this.state.value) {
            this.setValue(value);
        }
    }

    private setAutomaitcOpen(open: boolean): void {
        this.setState({ open: open });
    }

    private requestClose(): void {
        const { automatic, onRequestClose } = this.props;
        if(automatic) {
            this.setAutomaitcOpen(false);
        } else if(onRequestClose) {
            onRequestClose();
        }
    }

    private addPreventListener(event: string): void {
        Keyboard.addListener(event, this.preventEvent);
    }

    private removePreventListener(event: string): void {
        Keyboard.removeListener(event, this.preventEvent);
    }

    private actionKeyDownListener(actioner: (event: string, listener: NativeKeyboardEventHandler) => void): void {
        actioner('keydown', this.onKeyDown);
    }

    @bind
    private onFocus(event: React.FocusEvent): void {
        if(Keyboard.automaitcOpenPredicate()) {
            this.setAutomaitcOpen(true);
        }
    }

    @bind
    private onKeyboard(key: string): void {
        const { supportedSpecialKeys } = Keyboard;
        const { props, state } = this;
        const { onInput, layouts: propsLayout } = props;
        const { value, capsLock, layout } = state;
        switch(key) {
            case supportedSpecialKeys[0]: {
                if(onInput !== undefined) {
                    onInput(value);
                }
                return this.requestClose();
            }
            case supportedSpecialKeys[1]: return this.setValue(value.substring(0, value.length - 1));
            case supportedSpecialKeys[2]: return this.requestClose();
            case supportedSpecialKeys[3]: return this.setState({ capsLock: !capsLock });
            case supportedSpecialKeys[4]: return this.setState({ layout: (layout === propsLayout.length - 1) ? 0 : layout + 1 });
            default: return this.setValue(value + key);
        }
    }

    @bind
    private onKeyDown(event: KeyboardEvent): void {
        const { key } = event;
        event.stopImmediatePropagation();
        if((key.length === 1) || (Keyboard.getSupportedSpecialKeys().indexOf(key) !== -1)) {
            event.preventDefault();
            this.onKeyboard(key);
        }
    }

    @bind
    private onResize(event: UIEvent): void {
        this.forceUpdate();
    }

    @bind
    private refTextField(component: TextField): void {
        this.textField = component;
    }

    @bind
    private refKeyboardField(component: TextField): void {
        this.keyboardField = component;
        if(component !== null) {
            component.getInputNode().focus();
        }
    }

    @bind
    private preventEvent(event: FocusEvent): void {
        if(event.target === this.textField.getInputNode()) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }

    public getTextField(): TextField {
        return this.textField;
    }

    public getKeyboardField(): TextField {
        return this.keyboardField;
    }

    public makeCorrection(value: string): void {
        this.setState({ value: value });
    }

    public constructor(props: KeyboardProps, context: KeyboardContext) {
        super(props, context);
        this.state = {
            value: '',
            layout: 0,
            capsLock: false,
            open: false
        };
        this.context = context;
    }

    public componentDidMount(): void {
        window.addEventListener('resize', this.onResize, false);
        this.syncValue(this.getTextField().getInputNode().value);
    }

    public componentWillReceiveProps(props: KeyboardProps): void {
        const { value: textFieldValue } = this.props.textField.props;
        const { value: nextTextFieldValue } = props.textField.props;
        if(textFieldValue !== nextTextFieldValue) {
            this.syncValue(nextTextFieldValue);
        }
    }

    public shouldComponentUpdate(props: KeyboardProps, state: KeyboardState): boolean {
        const { textField } = props;
        const { textField: thisTextField } = this.props;
        if(this.state.value !== state.value) {
            return true;
        }
        if(this.state.open !== state.open) {
            return true;
        }
        if(this.state.capsLock !== state.capsLock) {
            return true;
        }
        if(this.state.layout !== state.layout) {
            return true;
        }
        if(this.props.open !== props.open) {
            return true;
        }
        if(this.props.nativeVirtualKeyboard !== props.nativeVirtualKeyboard) {
            return true;
        }
        if(this.props.keyboardKeyHeight !== props.keyboardKeyHeight) {
            return true;
        }
        if(this.props.keyboardKeySymbolSize !== props.keyboardKeySymbolSize) {
            return true;
        }
        if(this.props.keyboardKeyWidth !== props.keyboardKeyWidth) {
            return true;
        }
        if(this.props.automatic !== props.automatic) {
            return true;
        }
        if(this.props.correctorName !== props.correctorName) {
            return true;
        }
        if(this.props.corrector !== props.corrector) {
            return true;
        }
        if(this.props.onInput !== props.onInput) {
            return true;
        }
        if(this.props.onRequestClose !== props.onRequestClose) {
            return true;
        }
        if(thisTextField.type !== textField.type) {
            return true;
        }
        if(!deepEqual(this.props.layouts, props.layouts, { strict: true })) {
            return true;
        }
        if(!deepEqual(thisTextField.props, textField.props, { strict: true })) {
            return true;
        }

        return false;
    }

    public componentDidUpdate(props: KeyboardProps, state: KeyboardState): void {
        const { automatic } = this.props;
        const open: boolean = automatic ? this.state.open : this.props.open;
        const prev: boolean = automatic ? state.open : props.open;
        if(open !== prev) {
            if(open) {
                this.addPreventListener('focus');
                this.addPreventListener('blur');
                this.actionKeyDownListener(Keyboard.addListener);
            } else {
                this.textField.getInputNode().focus();
                this.removePreventListener('focus');
                this.removePreventListener('blur');
                this.actionKeyDownListener(Keyboard.removeListener);
                this.textField.getInputNode().blur();
            }
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, false);
    }

    public render(): JSX.Element {
        const { props, state, context, refTextField, refKeyboardField, onFocus, onKeyboard } = this;
        const { textField, layouts, keyboardKeyHeight, keyboardKeyWidth, keyboardKeySymbolSize, automatic, nativeVirtualKeyboard, correctorName, corrector } = props;
        const { value, layout: stateLayout, capsLock } = state;
        const { muiTheme} = context;
        const textFieldElement: TextFieldElement = textField;
        const open: boolean = automatic ? state.open : props.open;
        const automaitcOpenPredicted: boolean = Keyboard.automaitcOpenPredicate();
        const readOnly: boolean = automatic ? automaitcOpenPredicted : !Boolean(nativeVirtualKeyboard);
        const styles: React.CSSProperties = textFieldElement.props.style;
        let keyboardFieldProps: any = objectAssign({}, textFieldElement.props);
        let keyboardFieldStyle: any = objectAssign({}, styles);
        ['minWidth', 'width', 'maxWidth'].forEach((prop: string): void => {
            keyboardFieldStyle[prop] = '100%';
        });
        ['onChange', 'onFocus', 'onBlur', 'onKey', 'onKeyUp', 'onKeyDown', 'onKeyPress'].forEach((prop: string): void => {
            if(keyboardFieldProps.hasOwnProperty(prop)) {
                keyboardFieldProps[prop] = undefined;
            }
        });
        objectAssign(keyboardFieldProps, {
            readOnly: true,
            value: value, 
            style: keyboardFieldStyle,
            ref: refKeyboardField
        });
        if(correctorName !== undefined) {
            keyboardFieldProps[correctorName] = corrector.bind(this);
        }
        const keyboardTextField: TextFieldElement = React.cloneElement(textFieldElement, keyboardFieldProps);
        let inputTextFieldProps: TextFieldAccessedProps = objectAssign({}, textFieldElement.props, {
            ref: refTextField,
            readOnly: readOnly
        });
        if(automatic) {
            inputTextFieldProps.onFocus = onFocus;
        }
        const inputTextField: TextFieldElement = React.cloneElement(textFieldElement, inputTextFieldProps);
        const keyboardLayout: KeyboardLayout = KyeboardCapsLock(layouts[stateLayout], capsLock);
        const keyboardRowLengths: Array<number> = keyboardLayout.map((row: Array<string>): number => {
            let spacebar: number = 1;
            row.forEach((key: string): void => {
                if(key.match(/^\ +$/)) {
                    spacebar = key.length;
                }
            });
            return row.length + spacebar - 1;
        });
        const maxKeyboardRowLength: number = Math.max(...keyboardRowLengths);
        const keyboardRowLength: number = keyboardLayout.length;
        const theme: MuiTheme = muiTheme ? muiTheme : getMuiTheme();
        let keyHeight: number = keyboardKeyHeight !== undefined ? keyboardKeyHeight : theme.button.height;
        let keyWidth: number = keyboardKeyWidth !== undefined ? keyboardKeyWidth : theme.button.minWidth;
        let keySymbolSize: number = keyboardKeySymbolSize !== undefined ? keyboardKeySymbolSize : theme.flatButton.fontSize;
        const { desktopGutter, desktopKeylineIncrement } = theme.baseTheme.spacing;
        const dialogGutter: number = 2 * desktopGutter;
        const { minHeight, height, maxHeight } = (styles ? styles : Keyboard.noStyleHeight);
        const styleHeight: number = minHeight ? minHeight : (height ? height : (maxHeight ? maxHeight : 0));
        const textFieldHeight: number = styleHeight > 0 ? styleHeight : Keyboard.calculatedTextFieldHeight(inputTextFieldProps);
        let transformTop: number = desktopKeylineIncrement;
        let dialogWidth: number = (maxKeyboardRowLength * keyWidth) + dialogGutter;
        let dialogHeight: number = (keyboardRowLength * keyHeight) + textFieldHeight + dialogGutter;
        const { innerHeight, innerWidth } = window;
        const maxDialogHeight: number = innerHeight - 16;
        const dialogSpacingTop: number = maxDialogHeight - dialogHeight;
        const overwriteWidth: boolean = dialogWidth > innerWidth;
        const overwriteHeight: boolean = dialogSpacingTop < transformTop;
        if(overwriteWidth || overwriteHeight) {
            if(overwriteWidth) {
                dialogWidth = innerWidth;
                keyWidth = (innerWidth - dialogGutter) / maxKeyboardRowLength;
            }
            if(overwriteHeight) {
                if(dialogSpacingTop >= 0) {
                    transformTop = dialogSpacingTop;
                } else {
                    transformTop = 0;
                    dialogHeight = maxDialogHeight;
                    keyHeight = (dialogHeight - textFieldHeight - dialogGutter) / keyboardRowLength;
                }
            }
            const smallerSize: number = keyHeight < keyWidth ? keyHeight : keyWidth;
            keySymbolSize = smallerSize - (desktopGutter / 2);
        }
        const dialogContentStyle: React.CSSProperties = {
            width: dialogWidth,
            maxWidth: innerWidth,
            height: dialogHeight,
            maxHeight: maxDialogHeight,
            transform: `translate(0, ${transformTop}px)`
        };
        const keyboardRows: Array<KeyboardRow> = keyboardLayout.map((row: Array<string>, rowIndex: number): KeyboardRow => {
            const keyboardRowKeys: Array<KeyboardRowKey> = row.map((key: string, keyIndex: number): KeyboardRowKey => {
                const notSpacebar: boolean = key.match(/^\ +$/) === null;
                return (
                    <KeyboardKey
                        keyboardKey={notSpacebar ? key : ' '}
                        key={Number(`${rowIndex}.${keyIndex}`)}
                        onKeyPress={onKeyboard}
                        keyboardKeyHeight={keyHeight}
                        keyboardKeyWidth={keyWidth * (notSpacebar ? 1 : key.length)}
                        keyboardKeySymbolSize={keySymbolSize}
                    />
                );
            });
            return <div key={rowIndex}>{keyboardRowKeys}</div>;
        });
        const keyboard: JSX.Element = (
            <div style={styles}>
                {inputTextField}
                <Dialog
                    open={open}
                    modal
                    autoDetectWindowHeight={false}
                    contentStyle={dialogContentStyle}>
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
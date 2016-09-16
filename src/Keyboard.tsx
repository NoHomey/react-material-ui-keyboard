import * as React from 'react';
import bind from 'bind-decorator';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { KeyboardKey, KeyboardKeyProps } from './KeyboardKey';
import { KeyboardLayout, kyeboardCapsLockLayout } from './layouts';
import { MuiTheme } from 'material-ui/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import EventListenerService from 'event-listener-service';
import ActiveElement from './ActiveElement';
import objectAssign = require('object-assign');
import deepEqual = require('deep-equal');

export { KeyboardLayout };

export type RequestCloseHandler = () => void;

export type InputHandler = (input: string) => void;

export interface TextFieldRequiredProps {
    style?: React.CSSProperties;
    readOnly: boolean;
    value: string; 
    onFocus?: React.FocusEventHandler;
}

export interface TextFieldAccessedProps extends TextFieldRequiredProps {
    rows?: number;
    floatingLabelText?: string;
}

export type TextFieldElement = React.ReactElement<TextFieldRequiredProps>;

export type CreatableTextField = React.ComponentClass<TextFieldRequiredProps> | React.StatelessComponent<TextFieldRequiredProps>;

export type KeyboardRow = React.ReactElement<void>;

export type KeyboardRowKey = React.ReactElement<KeyboardKeyProps>;

export interface KeyboardProps {
    open?: boolean;
    automatic?: boolean;
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

export type AutomaitcOpenPredicate = () => boolean;

namespace constants {
    export const minusOne: number = -1;
    export const zero: number = 0;
    export const one: number = 1;
    export const two: number = 2;
    export const three: number = 3;
    export const four: number = 4;
    export const sixteen: number = 16;
    export const twentyFour: number = 24;
    export const fourtyEight: number = 48;
    export const seventyTwo: number = 72;
    export const emptyString: string = '';
    export const space: string = ' ';
    export const keydown: string = 'keydown';
    export const resize: string = 'resize';
    export const input: string = 'input';
    export const fullWidth: string = '100%';
    export const typeofString: string = 'string';
    export const typeofNumber: string = 'number';
    export const typeofFunction: string = 'function';
    export const boolTrue: boolean = true;
    export const boolFalse: boolean = false;
    export const isSpaceBar: RegExp = /^\ +$/;
    export const strictCompare: { strict: boolean } = { strict: boolTrue };
}

function allwaysTruePredicate(): boolean {
    return constants.boolTrue;
}

EventListenerService.setImplementation({
    addListener: window.addEventListener.bind(window),
    removeListener: window.removeEventListener.bind(window)
});

ActiveElement.isInput = () => document.activeElement.tagName.toLowerCase() === constants.input;
ActiveElement.blur = () => (document.activeElement as HTMLElement).blur();

export class Keyboard extends React.Component<KeyboardProps, KeyboardState> {
    private static overwriteProps(props: any): void {
        const { overwrittenProps } = Keyboard;
        let prop: string;
        for(let i: number = constants.zero; i < overwrittenProps.length; ++i) {
            prop = overwrittenProps[i];
            if(props.hasOwnProperty(prop)) {
                props[prop] = undefined;
            }
        }
    }

    private static calculateRowLength (row: Array<string>): number {
        let spacebar: number = constants.one;
        for(let i: number = constants.zero; i < row.length; ++i) {
            if(row[i].match(constants.isSpaceBar)) {
                spacebar = row[i].length;
            }
        }
        return row.length + spacebar - constants.one;
    }

    private static calculatedTextFieldHeight(props: TextFieldAccessedProps): number {
        const { rows, floatingLabelText } = props;
        const normalHeight: number = floatingLabelText ? constants.seventyTwo : constants.fourtyEight;
        return (rows ? ((rows - constants.one) * constants.twentyFour) : constants.zero) + normalHeight;
    }

    public static getSupportedSpecialKeys(): Array<string> {
        return Keyboard.supportedSpecialKeys;
    }

    private static supportedSpecialKeys: Array<string> = ['Enter', 'Backspace', 'Escape', 'CapsLock', 'Keyboard'];;
    private static overwrittenProps: Array<string> = ['onChange', 'onFocus', 'onBlur', 'onKey', 'onKeyUp', 'onKeyDown', 'onKeyPress'];
    private static noStyleHeight: React.CSSProperties = {
        minHeight: constants.zero,
        height: constants.zero,
        maxHeight: constants.zero
    };
    public static propTypes: React.ValidationMap<KeyboardProps> = {
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
    private corrector: Function;

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
            this.setAutomaitcOpen(constants.boolFalse);
        } else if(onRequestClose) {
            onRequestClose();
        }
    }

    @bind
    private onFocus(event: React.FocusEvent): void {
        if(Keyboard.automaitcOpenPredicate()) {
            this.setAutomaitcOpen(constants.boolTrue);
        }
    }

    @bind
    private onKeyboard(key: string): void {
        const { supportedSpecialKeys } = Keyboard;
        const { props, state } = this;
        const { onInput, layouts: propsLayout } = props;
        const { value, capsLock, layout } = state;
        switch(key) {
            case supportedSpecialKeys[constants.zero]:
                if(onInput) {
                    onInput(value);
                }
                return this.requestClose();
            case supportedSpecialKeys[constants.one]:
                return this.setValue(value.substring(constants.zero, value.length - constants.one));
            case supportedSpecialKeys[constants.two]:
                return this.requestClose();
            case supportedSpecialKeys[constants.three]: return this.setState({ capsLock: !capsLock });
            case supportedSpecialKeys[constants.four]:
                return this.setState({
                    layout: (layout === propsLayout.length - constants.one) ? constants.zero : layout + constants.one
                });
            default: return this.setValue(value + key);
        }
    }

    @bind
    private onKeyDown(event: KeyboardEvent): void {
        const { key } = event;
        event.stopImmediatePropagation();
        event.stopPropagation();
        if((key.length === constants.one) || (Keyboard.getSupportedSpecialKeys().indexOf(key) !== constants.minusOne)) {
            event.preventDefault();
            this.onKeyboard(key);
        }
    }

    @bind
    private onResize(event: UIEvent): void {
        this.forceUpdate();
    }

    public makeCorrection(value: string): void {
        this.setValue(value);
    }

    public constructor(props: KeyboardProps, context: KeyboardContext) {
        super(props, context);
        this.state = {
            value: constants.emptyString,
            layout: constants.zero,
            capsLock: constants.boolFalse,
            open: constants.boolFalse
        };
        this.context = context;
        this.corrector = null;
    }

    public componentWillMount(): void {
        const { corrector } = this.props;
        if(typeof corrector === constants.typeofFunction) {
            this.corrector = corrector.bind(this);
        }
    }

    public componentDidMount(): void {
        EventListenerService.addListener(constants.resize, this.onResize, constants.boolFalse);
        this.syncValue(this.props.textField.props.value);
    }

    public shouldComponentUpdate(props: KeyboardProps, state: KeyboardState): boolean {
        const { textField } = props;
        const { textField: thisTextField } = this.props;
        if(this.state.value !== state.value) {
            return constants.boolTrue;
        }
        if(this.state.open !== state.open) {
            return constants.boolTrue;
        }
        if(this.state.capsLock !== state.capsLock) {
            return constants.boolTrue;
        }
        if(this.state.layout !== state.layout) {
            return constants.boolTrue;
        }
        if(this.props.open !== props.open) {
            return constants.boolTrue;
        }
        if(this.props.keyboardKeyHeight !== props.keyboardKeyHeight) {
            return constants.boolTrue;
        }
        if(this.props.keyboardKeySymbolSize !== props.keyboardKeySymbolSize) {
            return constants.boolTrue;
        }
        if(this.props.keyboardKeyWidth !== props.keyboardKeyWidth) {
            return constants.boolTrue;
        }
        if(this.props.automatic !== props.automatic) {
            return constants.boolTrue;
        }
        if(this.props.correctorName !== props.correctorName) {
            return constants.boolTrue;
        }
        if(this.props.corrector !== props.corrector) {
            return constants.boolTrue;
        }
        if(this.props.onInput !== props.onInput) {
            return constants.boolTrue;
        }
        if(this.props.onRequestClose !== props.onRequestClose) {
            return constants.boolTrue;
        }
        if(thisTextField.type !== textField.type) {
            return constants.boolTrue;
        }
        if(!deepEqual(this.props.layouts, props.layouts, constants.strictCompare)) {
            return constants.boolTrue;
        }
        if(!deepEqual(thisTextField.props, textField.props, constants.strictCompare)) {
            return constants.boolTrue;
        }

        return constants.boolFalse;
    }

    public componentWillReceiveProps(props: KeyboardProps): void {
        const { textField, corrector } = props;
        const { value } = textField.props;
        if(this.props.textField.props.value !== value) {
            this.syncValue(value);
        }
        if(this.props.corrector !== corrector) {
            this.corrector = corrector.bind(this);
        }
    }

    public componentDidUpdate(props: KeyboardProps, state: KeyboardState): void {
        const { automatic } = this.props;;
        const open: boolean = automatic ? this.state.open : this.props.open;
        const prev: boolean = automatic ? state.open : props.open;
        if(open !== prev) {
            if(open) {
                if(ActiveElement.isInput()) {
                    ActiveElement.blur();
                }
                EventListenerService.addListener(constants.keydown, this.onKeyDown, constants.boolTrue);
            } else {
                EventListenerService.removeListener(constants.keydown, this.onKeyDown, constants.boolTrue);
            }
        }
    }

    public componentWillUnmount(): void {
        EventListenerService.removeListener(constants.resize, this.onResize, constants.boolFalse);
    }

    public render(): JSX.Element {
        const { props, state, context } = this;
        const { textField, layouts, keyboardKeyHeight, keyboardKeyWidth, keyboardKeySymbolSize, automatic, correctorName, corrector } = props;
        const { value, layout: stateLayout, capsLock } = state;
        const { muiTheme } = context;
        const open: boolean = automatic ? state.open : (props.open ? constants.boolTrue : constants.boolFalse);
        const theme: MuiTheme = muiTheme ? muiTheme : getMuiTheme();
        const styles: React.CSSProperties = textField.props.style;
        let keyboardFieldProps: any = objectAssign({}, textField.props);
        let inputTextFieldProps: TextFieldAccessedProps = objectAssign({}, textField.props, { readOnly: open });
        if(automatic || open) {
            inputTextFieldProps.onFocus = automatic ? this.onFocus : null;
        } 
        keyboardFieldProps.style = objectAssign({}, styles);
        keyboardFieldProps.style.minWidth = constants.fullWidth;
        keyboardFieldProps.style.width = constants.fullWidth;
        keyboardFieldProps.style.maxWidth = constants.fullWidth;
        keyboardFieldProps.readOnly = constants.boolTrue;
        keyboardFieldProps.value = value;
        if(typeof correctorName === constants.typeofString) {
            keyboardFieldProps[correctorName] = this.corrector;
        }
        Keyboard.overwriteProps(keyboardFieldProps);
        const inputTextField: TextFieldElement = React.cloneElement(textField, inputTextFieldProps);
        const keyboardTextField: TextFieldElement = React.createElement(textField.type as CreatableTextField, keyboardFieldProps);
        const keyboardLayout: KeyboardLayout = kyeboardCapsLockLayout(layouts[stateLayout], capsLock);
        const keyboardRowLength: number = keyboardLayout.length;
        const keyboardRowLengths: Array<number> = keyboardLayout.map(Keyboard.calculateRowLength);
        const maxKeyboardRowLength: number = Math.max(...keyboardRowLengths);
        let keyHeight: number = typeof keyboardKeyHeight === constants.typeofNumber ? keyboardKeyHeight : theme.button.height;
        let keyWidth: number = typeof keyboardKeyWidth === constants.typeofNumber ? keyboardKeyWidth : theme.button.minWidth;
        let keySymbolSize: number = typeof keyboardKeySymbolSize === constants.typeofNumber ? keyboardKeySymbolSize : theme.flatButton.fontSize;
        const { desktopGutter, desktopKeylineIncrement } = theme.baseTheme.spacing;
        const { innerHeight, innerWidth } = window;
        const { minHeight, height, maxHeight } = (styles ? styles : Keyboard.noStyleHeight);
        const dialogGutter: number = constants.two * desktopGutter;
        const styleHeight: number = minHeight ? minHeight : (height ? height : (maxHeight ? maxHeight : constants.zero));
        const textFieldHeight: number = styleHeight > constants.zero ? styleHeight : Keyboard.calculatedTextFieldHeight(inputTextFieldProps);
        let transformTop: number = desktopKeylineIncrement;
        let dialogWidth: number = (maxKeyboardRowLength * keyWidth) + dialogGutter;
        let dialogHeight: number = (keyboardRowLength * keyHeight) + textFieldHeight + dialogGutter;
        const maxDialogHeight: number = innerHeight - constants.sixteen;
        const dialogSpacingTop: number = maxDialogHeight - dialogHeight;
        const overwriteWidth: boolean = dialogWidth > innerWidth;
        const overwriteHeight: boolean = dialogSpacingTop < transformTop;
        if(overwriteWidth || overwriteHeight) {
            if(overwriteWidth) {
                dialogWidth = innerWidth;
                keyWidth = (innerWidth - dialogGutter) / maxKeyboardRowLength;
            }
            if(overwriteHeight) {
                if(dialogSpacingTop >= constants.zero) {
                    transformTop = dialogSpacingTop;
                } else {
                    transformTop = constants.zero;
                    dialogHeight = maxDialogHeight;
                    keyHeight = (dialogHeight - textFieldHeight - dialogGutter) / keyboardRowLength;
                }
            }
            const smallerSize: number = keyHeight < keyWidth ? keyHeight : keyWidth;
            keySymbolSize = smallerSize - (desktopGutter / constants.two);
        }
        const dialogContentStyle: React.CSSProperties = {
            width: dialogWidth,
            maxWidth: innerWidth,
            height: dialogHeight,
            maxHeight: maxDialogHeight,
            transform: `translate(0, ${transformTop}px)`
        };
        let keyboardRows: Array<KeyboardRow> = [];
        let keyboardRowKeys: Array<KeyboardRowKey>;
        let notSpacebar: boolean;
        let keyIndex: number;
        let key: string;
        for(let rowIndex: number = constants.zero; rowIndex < keyboardLayout.length; ++rowIndex) {
            keyboardRowKeys = [];
            for(keyIndex = constants.zero; keyIndex < keyboardLayout[rowIndex].length; ++keyIndex) {
                key = keyboardLayout[rowIndex][keyIndex];
                notSpacebar = key.match(constants.isSpaceBar) === null;
                keyboardRowKeys.push(
                    <KeyboardKey
                        keyboardKey={notSpacebar ? key : constants.space}
                        key={`${rowIndex}.${keyIndex}.${key}`}
                        onKeyPress={this.onKeyboard}
                        keyboardKeyHeight={keyHeight}
                        keyboardKeyWidth={keyWidth * (notSpacebar ? constants.one : key.length)}
                        keyboardKeySymbolSize={keySymbolSize}
                    />
                );
            }
            keyboardRows.push(<div key={rowIndex}>{keyboardRowKeys}</div>);
        }
        const keyboard: JSX.Element = (
            <div style={styles}>
                {inputTextField}
                <Dialog
                    open={open}
                    modal
                    autoDetectWindowHeight={constants.boolFalse}
                    contentStyle={dialogContentStyle}>
                        <div>
                            {keyboardTextField}
                            {keyboardRows}
                        </div>
                </Dialog>
            </div>
        );
        return muiTheme ? keyboard : <MuiThemeProvider>{keyboard}</MuiThemeProvider>;
    } 
};

export default Keyboard;
import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import List from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { KeyboardKey, KeyboardKeyProps } from './KeyboardKey';
import { MuiTheme } from 'material-ui/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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

export interface KeyboardType {
    type?: 'string' | 'number';
}

export interface KeyboardPropsValues extends KeyboardType {
    open: boolean;
    layouts: Array<KeyboardLayout>;
    keyboardKeyWidth?: number;
    keyboardKeyHeight?: number;
    keyboardKeySymbolSize?: number;
}

export interface TextFieldRequiredProps {
    value: string; 
    onKeyDown: React.KeyboardEventHandler;
    fullWidth: boolean;
}

export type TextFieldElement = React.ReactElement<TextFieldRequiredProps>;

export interface KeyboardProps extends KeyboardPropsValues {
    textField: TextFieldElement;
    onRequestClose: RequestCloseHandler;
    onInput: InputHandler;
};

export interface KeyboardState {
    value?: string;
    layout?: number;
    capsLock?: boolean;
};

interface KeyboardCompare extends KeyboardPropsValues, KeyboardState {

}

function getKeyboardCompare(props: KeyboardProps, state: KeyboardState): KeyboardCompare {
    return {
        type: props.type,
        open: props.open,
        layouts: props.layouts,
        keyboardKeyWidth: props.keyboardKeyWidth,
        keyboardKeyHeight: props.keyboardKeyHeight,
        keyboardKeySymbolSize: props.keyboardKeySymbolSize,
        value: state.value,
        layout: state.layout,
        capsLock: state.capsLock
    };
}

export interface KeyboardContext {
    muiTheme?: MuiTheme;
};

export class Keyboard extends React.Component<KeyboardProps, KeyboardState> {
    public static propTypes: Object = {
        type: React.PropTypes.oneOf(['string', 'number']),
        open: React.PropTypes.bool.isRequired,
        layouts: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string))).isRequired,
        keyboardKeyWidth: React.PropTypes.number,
        keyboardKeyHeight: React.PropTypes.number,
        keyboardKeySymbolSize: React.PropTypes.number,
        textField: React.PropTypes.element.isRequired,
        onRequestClose: React.PropTypes.func.isRequired,
        onInput: React.PropTypes.func.isRequired
    };
    public static defaultProps: KeyboardType = { type: 'string' };
    public static contextTypes: Object = { muiTheme: React.PropTypes.object };
    public static id: string = 'react-material-ui-keyboard-textField';

    public static getSupportedSpecialKeys(): Array<string> {
        return ['Enter', 'Backspace', 'Escape', 'CapsLock', 'Keyboard'];
    }

    public context: KeyboardContext;
    private _onKeyboard: (key: string) => void;
    private _onKeyDown: React.KeyboardEventHandler;

    private _getValue(): InputValue {
        const { props, state } = this;
        const { type } = props;
        const { value } = state;
        return type === 'string' ? value : Number(value);
    }

    private _handleKeyboard(key: string): void {
        const { props, state } = this;
        const { onInput, onRequestClose, layouts: propsLayout } = props;
        const { value, capsLock, layout: stateLayout } = state;
        switch(key) {
            case 'Enter': {
                onInput(this._getValue());
                onRequestClose();
                break;
            }
            case 'Backspace': {
                this.setState({ value: value.substring(0, value.length - 1) });
                break;
            }
            case 'Escape': {
                this.props.onRequestClose();
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
                this.setState({ value: value + key});
            }
        }
    }

    private _handleKeyDown(event: React.KeyboardEvent): void {
        const { key } = event;
        if((Keyboard.getSupportedSpecialKeys().indexOf(key) !== -1) || (key.match(/^(\ +|.)$/))) {
            event.preventDefault();
            this._handleKeyboard(key);
        }
    }

    public constructor(props: KeyboardProps, context: KeyboardContext) {
        super(props, context);
        this.state = {
            value: '',
            layout: 0,
            capsLock: false
        };
        this.context = context;
        this._onKeyboard = this._handleKeyboard.bind(this);
        this._onKeyDown = this._handleKeyDown.bind(this);
    }

    public shouldComponentUpdate(props: KeyboardProps, state: KeyboardState): boolean {
        const current: string = JSON.stringify(getKeyboardCompare(props, state));
        const compare: string = JSON.stringify(getKeyboardCompare(this.props, this.state));
        return current !== compare;
    }

    public render(): JSX.Element {
        const { props, state, context, _onKeyDown } = this;
        const { textField, layouts, keyboardKeyHeight, keyboardKeyWidth, keyboardKeySymbolSize, open  } = props;
        const { layout: stateLayout, capsLock } = state;
        const { muiTheme} = context;
        const textFieldElement: JSX.Element = textField as JSX.Element;
        let textFieldProps: any = Object.assign({}, textFieldElement.props);
        ['onChange', 'onFocus', 'onBlur', 'onKey', 'onKeyUp', 'onKeyDown', 'onKeyPress'].forEach((prop: string): void => {
            if(textFieldProps.hasOwnProperty(prop)) {
                delete textFieldProps[prop];
            }
        });
        Object.assign(textFieldProps, {
            id: Keyboard.id,
            value: this._getValue(), 
            onKeyDown: _onKeyDown,
            fullWidth: true,
            ref: () => { document.getElementById(Keyboard.id).focus(); }
        });
        const keyboardTextField: JSX.Element = React.cloneElement(textFieldElement, textFieldProps);
        const keyboardLayout: KeyboardLayout = KyeboardCapsLock(layouts[stateLayout], capsLock);
        let keyboardRowLengths: Array<number> = [];
        const keyboardRows: Array<React.ReactElement<void>> = keyboardLayout.map((row: Array<string>, rowIndex: number): React.ReactElement<void> => {
            let spacebar: number = 1;
            const keyboardRowKeys: Array<React.ReactElement<KeyboardKeyProps>> = row.map((key: string, keyIndex: number): React.ReactElement<KeyboardKeyProps> => {
                if(key.match(/^\ +$/)) {
                    spacebar = key.length;
                }
                return <KeyboardKey keyboardKey={key} key={Number(`${rowIndex}.${keyIndex}`)} onKeyPress={this._onKeyboard} />;
            });
            keyboardRowLengths.push(row.length + spacebar - 1);
            return <div key={rowIndex}>{keyboardRowKeys}</div>;
        });

        const maxKeyboardRowLength: number = Math.max(...keyboardRowLengths);

        let theme: MuiTheme = muiTheme ? Object.assign({}, muiTheme) : getMuiTheme();

        if(this.props.keyboardKeyHeight) {
            theme.button.height = keyboardKeyHeight;
        }
        if(this.props.keyboardKeyWidth) {
            theme.button.minWidth = keyboardKeyWidth;
        }
        if(this.props.keyboardKeySymbolSize) {
            theme.flatButton.fontSize = keyboardKeySymbolSize;
        }

        const dialogWidth: number = (maxKeyboardRowLength * theme.button.minWidth) + (2 * theme.baseTheme.spacing.desktopGutter);
        const dialogcontentStyle: React.CSSProperties = { width: dialogWidth, maxWidth: 'none' };
        return (
            <MuiThemeProvider muiTheme={theme}>
                <div>
                    {this.props.textField}
                    <Dialog open={open} modal={true} contentStyle={dialogcontentStyle} autoScrollBodyContent={true}>
                        <List>
                            <div>
                                {keyboardTextField}
                            </div>
                            <div>
                                <List>
                                    {keyboardRows}
                                </List>
                            </div>
                        </List>
                    </Dialog>
                </div>
            </MuiThemeProvider>
        );
    } 
};

export default Keyboard;
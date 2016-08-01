import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import List from 'material-ui/List';
import SimpleListItem from './SimpleListItem';
import { KeyboardKey, KeyboardKeyProps, KeyboardKeyHandller, KeyboardKeyContext } from './KeyboardKey';

const { div } = React.DOM;

const AlphaNumbericKeyboard: KeyboardLayout = [
    ['1',      '2',        '3', '4', '5', '6', '7', '8', '9',         '0'],
    ['q',      'w',        'e', 'r', 't', 'y', 'u', 'i', 'o',         'p'],
    ['a',      's',        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Backspace'],
    ['Escape', 'CapsLock', 'z', 'x', 'c', 'v', 'b', 'n', 'm',     'Enter']
];

const CapsedAlphaNumbericKeyboard: KeyboardLayout = KyeboardCapsLock(AlphaNumbericKeyboard, true);

const NumbericKeyboard: KeyboardLayout = [
    ['Escape', '', 'Backspace'],
    ['7',      '8',        '9'],
    ['4',      '5',        '6'],
    ['1',      '2',        '3'],
    ['0',      '.',    'Enter']
];

export { KeyboardKeyContext, AlphaNumbericKeyboard, CapsedAlphaNumbericKeyboard, NumbericKeyboard };

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

export interface KeyboardProps {
    textField: React.ReactNode;
    open: boolean;
    onRequestClose: RequestCloseHandler;
    onInput: InputHandler;
    layout: Array<KeyboardLayout>;
};

export interface KeyboardState {
    value?: string;
    layout?: number;
    capsLock?: boolean;
};

export class Keyboard extends React.Component<KeyboardProps, KeyboardState> {
    public static contextTypes = KeyboardKey.contextTypes;
    public context: KeyboardKeyContext;
    private _onKeyboard: (key: string) => void;
    private _onKeyDown: React.KeyboardEventHandler;

    private _handleKeyboard(key: string): void {
        switch(key) {
            case 'Enter': {
                this.props.onInput(this.state.value);
                this.props.onRequestClose();
                break;
            }
            case 'Backspace': {
                this.setState({ value: this.state.value.substring(0, this.state.value.length - 1) });
                break;
            }
            case 'Escape': {
                this.props.onRequestClose();
                break;
            }
            case 'CapsLock': {
                this.setState({ capsLock: !this.state.capsLock });
                break;
            }
            case 'Keyboard': {
                const layout: number = this.state.layout;
                this.setState({ layout: (layout === this.props.layout.length - 1) ? 0 : layout + 1 });
            }
            default: {
                this.setState({ value: this.state.value + key});
            }
        }
    }

    private _handleKeyDown(event: React.KeyboardEvent): void {
        this._handleKeyboard(event.key);
    }

    public constructor(props: KeyboardProps, context: KeyboardKeyContext) {
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
        const propsChange: boolean = (this.props.open !== props.open);
        const stateChange: boolean = (this.state.value !== state.value) || (this.state.layout !== state.layout) || (this.state.capsLock !== state.capsLock);
        return propsChange || stateChange;
    }

    public componentDidUpdate(props: KeyboardProps, state: KeyboardState): void {
        if(this.props.open) {
            KeyboardKeyHandller.onKeyPress = this._onKeyboard;
        }
    }

    public render(): JSX.Element {
        const keyboardTextField: JSX.Element = React.cloneElement(this.props.textField as JSX.Element, {
            id: "react-material-ui-keyboard-TextField",
            value: this.state.value,
            onKeyDown: this._onKeyDown,
            fullWidth: true,
            onFocus: undefined,
            onChange: undefined,
        });

        const keyboardLayout: KeyboardLayout = KyeboardCapsLock(this.props.layout[this.state.layout], this.state.capsLock);

        const keyboardRows: Array<React.ReactElement<void>> = keyboardLayout.map((row: Array<string>, rowIndex: number): React.ReactElement<void> => {
            const keyboardRowKeys: Array<React.ReactElement<KeyboardKeyProps>> = row.map((key: string, keyIndex: number): React.ReactElement<KeyboardKeyProps> => {
                return <KeyboardKey keyboardKey={key} key={Number(`${rowIndex}.${keyIndex}`)} />;
            });
            return <SimpleListItem key={rowIndex}>{keyboardRowKeys}</SimpleListItem>;
        });

        const keyboardRowLengths: Array<number> = keyboardLayout.map((row: Array<string>): number => {
            return row.length;
        });

        const maxKeyboardRowLength: number = Math.max(...keyboardRowLengths);

        const dialogWidth: number = (maxKeyboardRowLength * this.context.muiTheme.button.minWidth) + (2 * this.context.muiTheme.spacing.desktopGutter);

        console.log(dialogWidth, maxKeyboardRowLength);

        return (
            <div>
                {this.props.textField}
                <Dialog open={this.props.open} modal={true} contentStyle={{ width: dialogWidth, maxWidth: 'none' }}>
                    <List>
                        <SimpleListItem>
                            {keyboardTextField}
                        </SimpleListItem>
                        <SimpleListItem>
                            <List>
                                {keyboardRows}
                            </List>
                        </SimpleListItem>
                    </List>
                </Dialog>
            </div>
        );
    } 
};

export default Keyboard;
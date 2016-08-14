import * as React from 'react';
import TextField from 'material-ui/TextField';
import { Keyboard, RequestCloseHandler, InputHandler, ExtendedKeyboard, TextFieldElement } from './../src/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiTheme } from 'material-ui/styles';  

const { div, link } = React.DOM;

export interface DemoState {
    open?: boolean;
    value?: string;
};

export interface TextEnterTarget {
    value?: string;
};

export interface TextEnterEvent {
    target: TextEnterTarget;
};

export default class Demo extends React.Component<void, DemoState> {
    private _onFocus: React.FocusEventHandler;
    private _onBlur: React.FocusEventHandler;
    private _onChange: React.FormEventHandler;
    private _onRequestClose: RequestCloseHandler;
    private _onInput: InputHandler;

    private _handleFocus(event: React.FocusEvent): void {
        console.log('focus');
        this.setState({ open: true });
    }

    private _handleBlur(event: React.FocusEvent): void {
        console.log(`onBlur ${this.state.value}`);
    }

    private _handleChange(event: React.FormEvent): void {
        const textEnterEvent: TextEnterEvent = event as TextEnterEvent;
        const value: string = textEnterEvent.target.value;
        this.setState({ value: value });
    }

    private _handleRequestClose(): void {
        this.setState({ open: false });
    }

    private _handleInput(input: string): void {
        this.setState({ value: input });
    }

    public constructor(props: void) {
        super(props);
        this.state = {
            open: false,
            value: ''
        };
        this._onFocus = this._handleFocus.bind(this);
        this._onBlur = this._handleBlur.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onRequestClose = this._handleRequestClose.bind(this);
        this._onInput = this._handleInput.bind(this);
    }

    public render(): JSX.Element {
        const { state, _onFocus, _onChange, _onRequestClose, _onInput, _onBlur } = this;
        const { value, open } = state;
        const textField: TextFieldElement = (
            <TextField
                id="field"
                value={value}
                onFocus={_onFocus}
                onBlur={_onBlur}
                onChange={_onChange}
                floatingLabelText="Click for a Keyboard" />
        );

        return (
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <Keyboard
                        textField={textField}
                        open={open}
                        onRequestClose={_onRequestClose}
                        onInput={_onInput}
                        layouts={[ExtendedKeyboard]}
                        keyboardKeyHeight={50}
                        keyboardKeyWidth={100}
                        keyboardKeySymbolSize={36}
                     />
                </div>
        );
    }
};
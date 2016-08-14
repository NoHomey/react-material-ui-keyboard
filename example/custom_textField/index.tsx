import * as React from 'react';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue, NumberInputErrorHandler } from 'material-ui-number-input';
import { Keyboard, RequestCloseHandler, InputHandler, NumericKeyboard, TextFieldElement } from 'react-material-ui-keyboard';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiTheme } from 'material-ui/styles';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

const { div, link } = React.DOM;

interface DemoState {
    open?: boolean;
    value?: string;
    error?: NumberInputError;
    errorText?: string;
};

class Demo extends React.Component<void, DemoState> {
    private _onFocus: React.FocusEventHandler;
    private _onChange: React.FormEventHandler;
    private _onRequestClose: RequestCloseHandler;
    private _onInput: InputHandler;
    private _onError: NumberInputErrorHandler;

    private _handleFocus(event: React.FocusEvent): void {
        this.setState({ open: true });
    }

    private _handleChange(event: React.FormEvent, value: string): void {
        console.log(value);
        this.setState({ value: value });
    }

    private _handleRequestClose(): void {
        this.setState({ open: false });
    }

    private _handleInput(input: string): void {
        console.log(input);
        this.setState({ value: input });
    }

    private _handleError(error: NumberInputError): void {
        let errorText: string;
        switch(error) {
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
        this.setState({ errorText: errorText, error: error });
    }

    public constructor(props: void) {
        super(props);
        this.state = { open: false };
        this._onFocus = this._handleFocus.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onRequestClose = this._handleRequestClose.bind(this);
        this._onInput = this._handleInput.bind(this);
        this._onError = this._handleError.bind(this);
    }

    componentDidUpdate(props: void, state: DemoState) {
        const { error: prevError } = state;
        const { error, value } = this.state;
        if((error === 'none') && (prevError !== 'none')) {
        alert(`${Number(value)} is a valid number`);
        }
    }

    public render(): JSX.Element {
        const { state, _onFocus, _onChange, _onError, } = this;
        const { error, value, errorText } = state;
        const textField: TextFieldElement = (
            <NumberInput
                id="num"
                error={error}
                required
                value={value}
                min={-10}
                max={12}
                errorText={errorText}
                onFocus={_onFocus}
                onChange={_onChange}
                onError={_onError}
                floatingLabelText="Click for a Keyboard" />
        );

        return (
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <Keyboard
                        textField={textField}
                        open={this.state.open}
                        onRequestClose={this._onRequestClose}
                        onInput={this._onInput}
                        layouts={[NumericKeyboard]}
                        keyboardKeyHeight={50}
                        keyboardKeyWidth={100}
                        keyboardKeySymbolSize={36}
                     />
                </div>
        );
    }
};

injectTapEventPlugin();
let bootstrapNode = document.createElement('div');
ReactDomRender(<Demo />, bootstrapNode);
document.body.appendChild(bootstrapNode);

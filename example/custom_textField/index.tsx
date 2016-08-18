import * as React from 'react';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue, NumberInputErrorHandler, NumberInputValidHandler } from 'material-ui-number-input';
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
    errorText?: string;
};

class Demo extends React.Component<void, DemoState> {
    private _onFocus: React.FocusEventHandler;
    private _onChange: React.FormEventHandler;
    private _onRequestClose: RequestCloseHandler;
    private _onInput: InputHandler;
    private _onError: NumberInputErrorHandler;
    private _onValid: NumberInputValidHandler;

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
        this.setState({ errorText: errorText });
    }

    private _handleValid(value: number): void {
        console.debug(`valid ${value}`);
    }

    public constructor(props: void) {
        super(props);
        this.state = { open: false,  value: '' };
        this._onFocus = this._handleFocus.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onRequestClose = this._handleRequestClose.bind(this);
        this._onInput = this._handleInput.bind(this);
        this._onError = this._handleError.bind(this);
        this._onValid = this._handleValid.bind(this);
    }

    public render(): JSX.Element {
        const { state, _onFocus, _onChange, _onError, _onValid } = this;
        const { value, errorText } = state;
        const textField: TextFieldElement = (
            <NumberInput
                id="num"
                required
                value={value}
                min={-10}
                max={12}
                useStrategy="ignore"
                errorText={errorText}
                onFocus={_onFocus}
                onChange={_onChange}
                onError={_onError}
                onValid={_onValid}
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
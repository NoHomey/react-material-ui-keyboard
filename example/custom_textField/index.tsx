import * as React from 'react';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue, NumberInputErrorHandler, NumberInputValidHandler } from 'material-ui-number-input';
import { Keyboard, RequestCloseHandler, InputHandler } from 'react-material-ui-keyboard';
import { numericKeyboard } from 'react-material-ui-keyboard/layouts';
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

function corrector(value: string): void {
    (this as Keyboard).makeCorrection(value);
}

class Demo extends React.Component<void, DemoState> {
    private onFocus: React.FocusEventHandler;
    private onChange: React.FormEventHandler;
    private onRequestClose: RequestCloseHandler;
    private onInput: InputHandler;
    private onError: NumberInputErrorHandler;
    private onValid: NumberInputValidHandler;

    private canOpenKeyboard(): boolean {
        return (this.state.value.length % 2) === 0;
    }

    private handleFocus(event: React.FocusEvent): void {
        if(this.canOpenKeyboard()) {
            this.setState({ open: true });
        }
    }

    private handleChange(event: React.FormEvent, value: string): void {
        console.log(value);
        this.setState({ value: value });
    }

    private handleRequestClose(): void {
        this.setState({ open: false });
    }

    private handleInput(input: string): void {
        console.log(input);
        this.setState({ value: input });
    }

    private handleError(error: NumberInputError): void {
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
                errorText = 'You are tring to enter number greater than 120';
                break;
        }
        this.setState({ errorText: errorText });
    }

    private handleValid(value: number): void {
        console.debug(`valid ${value}`);
    }

    public constructor(props: void) {
        super(props);
        this.state = { open: false,  value: '' };
        this.onFocus = this.handleFocus.bind(this);
        this.onChange = this.handleChange.bind(this);
        this.onRequestClose = this.handleRequestClose.bind(this);
        this.onInput = this.handleInput.bind(this);
        this.onError = this.handleError.bind(this);
        this.onValid = this.handleValid.bind(this);
    }

    public componentDidMount(): void {
        setTimeout(() => this.setState({ value: '89' }), 1000);
    }

    public render(): JSX.Element {
        const { state, onFocus, onChange, onError, onValid } = this;
        const { value, errorText } = state;
        const textField: JSX.Element = (
            <NumberInput
                id="num"
                required
                value={value}
                min={-10}
                max={120}
                strategy="warn"
                errorText={errorText}
                onFocus={onFocus}
                onChange={onChange}
                onError={onError}
                onValid={onValid}
                floatingLabelText="Click for a Keyboard" />
        );

        return (
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <Keyboard
                        textField={textField}
                        open={this.state.open}
                        onRequestClose={this.onRequestClose}
                        onInput={this.onInput}
                        correctorName="onRequestValue"
                        corrector={corrector}
                        layouts={[numericKeyboard]}
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

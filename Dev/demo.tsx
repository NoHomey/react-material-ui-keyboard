import * as React from 'react';
import TextField from 'material-ui/TextField';
import { Keyboard, RequestCloseHandler, InputHandler, ExtendedKeyboard, TextFieldElement } from './../src/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiTheme } from 'material-ui/styles';  

const { div, link } = React.DOM;

export interface DemoState {
    value?: string;
};

export interface TextEnterTarget {
    value?: string;
};

export interface TextEnterEvent {
    target: TextEnterTarget;
};

export default class Demo extends React.Component<void, DemoState> {
    private _onInput: InputHandler;

    private _handleInput(input: string): void {
        this.setState({ value: input });
    }

    public constructor(props: void) {
        super(props);
        this.state = { value: '12' };
        this._onInput = this._handleInput.bind(this);
    }

    public componentDidMount(): void {
        setTimeout(() => this.setState({ value: '123456' }), 1000);
    }

    public render(): JSX.Element {
        const { state, _onInput, } = this;
        const { value } = state;
        const textField: TextFieldElement = (
            <TextField
                id="field"
                value={value}
                style={{ width: 200, height: 60 }}
                floatingLabelText="Click for a Keyboard" />
        );

        return (
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <Keyboard
                        automatic
                        textField={textField}
                        onInput={_onInput}
                        layouts={[ExtendedKeyboard]}
                     />
                </div>
        );
    }
};
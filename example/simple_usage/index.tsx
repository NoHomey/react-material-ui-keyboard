import * as React from 'react';
import TextField from 'material-ui/TextField';
import { Keyboard, RequestCloseHandler, InputHandler, ExtendedKeyboard, TextFieldElement } from 'react-material-ui-keyboard';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiTheme } from 'material-ui/styles';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

const { div, link } = React.DOM;

interface DemoState {
    value?: string;
};

interface TextEnterTarget {
    value?: string;
};

interface TextEnterEvent {
    target: TextEnterTarget;
};

class Demo extends React.Component<void, DemoState> {
    private _onInput: InputHandler;

    private _handleInput(input: string): void {
        this.setState({ value: input });
    }

    public constructor(props: void) {
        super(props);
        this.state = {  value: '' };
        this._onInput = this._handleInput.bind(this);
    }

    public render(): JSX.Element {
        const { state, _onInput } = this;
        const { value } = state;
        const textField: TextFieldElement = (
            <TextField
                id="field"
                value={value}
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

injectTapEventPlugin();
let bootstrapNode = document.createElement('div');
ReactDomRender(<Demo />, bootstrapNode);
document.body.appendChild(bootstrapNode);

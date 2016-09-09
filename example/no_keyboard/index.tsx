import * as React from 'react';
import TextField from 'material-ui/TextField';
import { Keyboard, RequestCloseHandler, InputHandler } from 'react-material-ui-keyboard';
import { extendedKeyboard } from 'react-material-ui-keyboard/layouts';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiTheme } from 'material-ui/styles';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

const { div, link } = React.DOM;

interface DemoState {
    value?: string;
}

interface TextEnterTarget {
    value?: string;
}

interface TextEnterEvent {
    target: TextEnterTarget;
}

class Demo extends React.Component<void, DemoState> {
    private _onChange: React.FormEventHandler;

    private _handleChange(event: React.FormEvent): void {
        const textEnterEvent: TextEnterEvent = event as TextEnterEvent;
        const value: string = textEnterEvent.target.value;
        this.setState({ value: value });
    }

    public constructor(props: void) {
        super(props);
        this.state = { value: '' };
        this._onChange = this._handleChange.bind(this);
    }

    public render(): JSX.Element {
        const { state, _onChange } = this;
        const { value } = state;
        const textField: JSX.Element = (
            <TextField
                id="field"
                value={value}
                onChange={_onChange}
                floatingLabelText="Click for a Keyboard" />
        );

        return (
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <Keyboard
                        textField={textField}
                        open={false}
                        layouts={[extendedKeyboard]}
                     />
                </div>
        );
    }
};

injectTapEventPlugin();
let bootstrapNode = document.createElement('div');
ReactDomRender(<Demo />, bootstrapNode);
document.body.appendChild(bootstrapNode);

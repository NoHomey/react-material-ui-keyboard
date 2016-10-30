import * as React from 'react';
import TextField from 'material-ui/TextField';
import { Keyboard, InputHandler, KeyboardLayout } from 'react-material-ui-keyboard';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

interface DemoState {
    value?: string;
};

const layout1: KeyboardLayout = [
    ['Escape', 'Keyboard', 'CapsLock', 'Backspace', 'Enter'],
    ['a',       'b',       'c',        'd',             'e']
];

const layout2: KeyboardLayout = [
    ['z',       'x',       'y',        'u',             'q'],
    ['Escape', 'Keyboard', 'CapsLock', 'Backspace', 'Enter']
];

const layouts: Array<KeyboardLayout> = [layout1, layout2];

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
        const textField: JSX.Element = (
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
                        keyboardKeyHeight={65}
                        keyboardKeyWidth={105}
                        keyboardKeySymbolSize={35}
                        textField={textField}
                        onInput={_onInput}
                        layouts={layouts}
                     />
                </div>
        );
    }
};

injectTapEventPlugin();
let bootstrapNode = document.createElement('div');
ReactDomRender(<Demo />, bootstrapNode);
document.body.appendChild(bootstrapNode);

import * as React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Backspace from 'material-ui/svg-icons/content/backspace';
import Enter from 'material-ui/svg-icons/hardware/keyboard-return';
import Escape from 'material-ui/svg-icons/action/exit-to-app';
import Keyboard from 'material-ui/svg-icons/hardware/keyboard';
import CapsLock from 'material-ui/svg-icons/hardware/keyboard-capslock';
import { MuiTheme } from 'material-ui/styles';

const { span } = React.DOM;

export type KeyboardKeyPressHandler = (key: string) => void;

export interface KeyboardKeyProps {
    keyboardKey: string;
    onKeyPress: KeyboardKeyPressHandler;
};

export interface KeyboardKeyContext {
    muiTheme: MuiTheme;
};


export class KeyboardKey extends React.Component<KeyboardKeyProps, void> {
    public static contextTypes: Object = {
        muiTheme: React.PropTypes.object.isRequired
    };
    public context: KeyboardKeyContext;
    private _onClick: React.MouseEventHandler;

    private _handleClick(event: React.MouseEvent): void {
        this.props.onKeyPress(this.props.keyboardKey);
    }

    public constructor(props: KeyboardKeyProps, context: KeyboardKeyContext) {
        super(props, context);
        this.context = context;
        this._onClick = this._handleClick.bind(this);
    }

    public shouldComponentUpdate(props: KeyboardKeyProps, state: void): boolean {
        return this.props.keyboardKey!== props.keyboardKey;
    }

    public render(): JSX.Element {
        const key: string = this.props.keyboardKey;
        let keyboardKey: JSX.Element;

        if(!key) {
            return <FlatButton disabled label=" " />;
        }

        if(key.length === 1) {
            keyboardKey = <FlatButton label={key} labelStyle={{ textTransform: 'none' }}/>;
        } else {
            let icon: JSX.Element;
            switch(key) {
                case 'Enter': {
                    icon = <Enter />;
                    break;
                }
                case 'Backspace': {
                    icon = <Backspace />;
                    break;
                }
                case 'Escape': {
                    icon = <Escape />;
                    break;
                }
                case 'CapsLock': {
                    icon = <CapsLock />;
                    break;
                }
                case 'Keyboard': {
                    icon = <Keyboard />;
                    break;
                }
            }
            const size: number = this.context.muiTheme.flatButton.fontSize;
            const style: React.CSSProperties =  {width: size, height: size};
            keyboardKey = <FlatButton icon={React.cloneElement(icon, { style: style })} />;
        }
        
        return React.cloneElement(keyboardKey, {
            primary: true,
            onClick: this._onClick
        });
    }
};

export default KeyboardKey;
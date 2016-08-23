import * as React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Backspace from 'material-ui/svg-icons/content/backspace';
import Enter from 'material-ui/svg-icons/hardware/keyboard-return';
import Escape from 'material-ui/svg-icons/action/exit-to-app';
import Keyboard from 'material-ui/svg-icons/hardware/keyboard';
import CapsLock from 'material-ui/svg-icons/hardware/keyboard-capslock';
import Spacebar from 'material-ui/svg-icons/editor/space-bar';
import { MuiTheme } from 'material-ui/styles';

const { span } = React.DOM;

export type KeyboardKeyPressHandler = (key: string) => void;

export interface KeyboardKeyProps {
    keyboardKey: string;
    onKeyPress: KeyboardKeyPressHandler;
    keyboardKeyWidth: number;
    keyboardKeyHeight: number;
    keyboardKeySymbolSize: number;
}

export class KeyboardKey extends React.Component<KeyboardKeyProps, void> {
    private _onClick: React.MouseEventHandler;

    private _handleClick(event: React.MouseEvent): void {
        this.props.onKeyPress(this.props.keyboardKey);
    }

    public constructor(props: KeyboardKeyProps) {
        super(props);
        this._onClick = this._handleClick.bind(this);
    }

    public shouldComponentUpdate(props: KeyboardKeyProps, state: void): boolean {
        return this.props.keyboardKey!== props.keyboardKey;
    }

    public render(): JSX.Element {
        const { keyboardKey: key, keyboardKeyHeight: height, keyboardKeyWidth: width, keyboardKeySymbolSize: size } = this.props;
        const notSpacebar: boolean = key.match(/^\ +$/) === null;
        let keyboardKey: JSX.Element;

        if(key) {
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
                    default: {
                        if(!notSpacebar) {
                            icon = <Spacebar />;
                            break;
                        }
                    }
                }
                icon = React.cloneElement(icon, { style: { width: size, height: size } });
                keyboardKey = <FlatButton icon={icon} />;
            }
        } else {
            keyboardKey = <FlatButton disabled label=" " />;
        }
        const style: React.CSSProperties = {
            height: height,
            width: notSpacebar ? width : (width * key.length)
        }
        return React.cloneElement(keyboardKey, {
            style: style,
            labelStyle: { fontSize: size },
            primary: true,
            onClick: this._onClick
        });
    }
};

export default KeyboardKey;
import * as React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Backspace from 'material-ui/svg-icons/content/backspace';
import Enter from 'material-ui/svg-icons/hardware/keyboard-return';
import Escape from 'material-ui/svg-icons/action/exit-to-app';
import Keyboard from 'material-ui/svg-icons/hardware/keyboard';
import CapsLock from 'material-ui/svg-icons/hardware/keyboard-capslock';
import Spacebar from 'material-ui/svg-icons/editor/space-bar';
import { TouchTapEventHandler, TouchTapEvent } from 'material-ui';

export type KeyboardKeyPressHandler = (key: string) => void;

export interface KeyboardKeyProps {
    keyboardKey: string;
    onKeyPress: KeyboardKeyPressHandler;
    keyboardKeyWidth: number;
    keyboardKeyHeight: number;
    keyboardKeySymbolSize: number;
}

export class KeyboardKey extends React.Component<KeyboardKeyProps, void> {
    public static propTypes: Object = {
        keyboardKey: React.PropTypes.string.isRequired,
        onKeyPress: React.PropTypes.func.isRequired,
        keyboardKeyWidth: React.PropTypes.number.isRequired,
        keyboardKeyHeight: React.PropTypes.number.isRequired,
        keyboardKeySymbolSize: React.PropTypes.number.isRequired,
    };
    private _onTouchTap: TouchTapEventHandler;

    private _handleTouchTap(event: TouchTapEvent): void {
        this.props.onKeyPress(this.props.keyboardKey);
    }

    public constructor(props: KeyboardKeyProps) {
        super(props);
        this._onTouchTap = this._handleTouchTap.bind(this);
    }

    public render(): JSX.Element {
        const { _onTouchTap, props } = this;
        const { keyboardKey: key, keyboardKeyHeight: height, keyboardKeyWidth: width, keyboardKeySymbolSize: size } = props;
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
            width: notSpacebar ? width : (width * key.length), 
            minWidth: width
        }
        return React.cloneElement(keyboardKey, {
            style: style,
            labelStyle: { fontSize: size, textTransform: 'none' },
            primary: true,
            onTouchTap: _onTouchTap
        });
    }
};

export default KeyboardKey;
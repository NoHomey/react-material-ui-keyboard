import * as React from 'react';
import bind from 'bind-decorator';
import FlatButton from 'material-ui/FlatButton';
import Backspace from 'material-ui/svg-icons/content/backspace';
import Enter from 'material-ui/svg-icons/hardware/keyboard-return';
import Escape from 'material-ui/svg-icons/action/exit-to-app';
import Keyboard from 'material-ui/svg-icons/hardware/keyboard';
import CapsLock from 'material-ui/svg-icons/hardware/keyboard-capslock';
import Spacebar from 'material-ui/svg-icons/editor/space-bar';
import Warning from 'material-ui/svg-icons/alert/warning';
import { TouchTapEvent } from 'material-ui';

export type KeyboardKeyPressHandler = (key: string) => void;

export interface KeyboardKeyProps {
    keyboardKey: string;
    onKeyPress: KeyboardKeyPressHandler;
    keyboardKeyWidth: number;
    keyboardKeyHeight: number;
    keyboardKeySymbolSize: number;
}

interface SpecialIcons {
    [index: string]: React.ComponentClass<any>;
}

namespace constants {
    export const one: number = 1;
    export const spacebar: string = ' ';
    export const none: string = 'none';
    export const notFound: string = 'notFound';
    export const boolTrue: boolean = true;
    export const boolFalse: boolean = false;
}

export class KeyboardKey extends React.Component<KeyboardKeyProps, void> {
    private static specialIcons: SpecialIcons = {
        'Enter': Enter,
        'Backspace': Backspace,
        'Escape': Escape,
        'CapsLock': CapsLock,
        'Keyboard': Keyboard,
        ' ' : Spacebar,
        'notFound': Warning
    };

    public static propTypes: React.ValidationMap<KeyboardKeyProps> = {
        keyboardKey: React.PropTypes.string.isRequired,
        onKeyPress: React.PropTypes.func.isRequired,
        keyboardKeyWidth: React.PropTypes.number.isRequired,
        keyboardKeyHeight: React.PropTypes.number.isRequired,
        keyboardKeySymbolSize: React.PropTypes.number.isRequired,
    };

    @bind
    private onTouchTap(event: TouchTapEvent): void {
        const { onKeyPress, keyboardKey } = this.props;
        if((keyboardKey.length === 1) || KeyboardKey.specialIcons.hasOwnProperty(keyboardKey)) {
            onKeyPress(keyboardKey);
        }
    }

    public constructor(props: KeyboardKeyProps) {
        super(props);
    }

    public shouldComponentUpdate(props: KeyboardKeyProps, state: void): boolean {
        if(this.props.keyboardKey !== props.keyboardKey) {
            return constants.boolTrue;
        }
        if(this.props.keyboardKeyHeight !== props.keyboardKeyHeight) {
            return constants.boolTrue;
        }
        if(this.props.keyboardKeySymbolSize !== props.keyboardKeySymbolSize) {
            return constants.boolTrue;
        }
        if(this.props.keyboardKeyWidth !== props.keyboardKeyWidth) {
            return constants.boolTrue;
        }
        if(this.props.onKeyPress !== props.onKeyPress) {
            return constants.boolTrue;
        }
        
        return constants.boolFalse;
    }

    public render(): JSX.Element {
        const { keyboardKey: key, keyboardKeyHeight: height, keyboardKeyWidth: width, keyboardKeySymbolSize: size } = this.props;
        let flatButtonProps: any = {
            style: {
                height: height,
                width: width, 
                minWidth: width
            },
            primary: constants.boolTrue,
            onTouchTap: this.onTouchTap
        };
        if((key.length <= constants.one) && (key !== constants.spacebar)) {
            if(key.length) {
                flatButtonProps.label = key;
            } else {
                flatButtonProps.disabled = constants.boolTrue;
                flatButtonProps.label = constants.spacebar;
            }
            flatButtonProps.labelStyle = { fontSize: size, textTransform: constants.none };
        } else {
            const { specialIcons } =  KeyboardKey;
            const icon: React.ComponentClass<any> = specialIcons[specialIcons.hasOwnProperty(key) ? key : constants.notFound];
            flatButtonProps.icon = React.createElement(icon, { style: { width: size, height: size } });
        }
        return React.createElement(FlatButton,  flatButtonProps);
    }
};

export default KeyboardKey;
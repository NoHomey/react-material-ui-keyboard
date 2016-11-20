import { KeyboardKey, KeyboardKeyProps, KeyboardKeyPressHandler } from './../src/KeyboardKey';
import * as React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Backspace from 'material-ui/svg-icons/content/backspace';
import Enter from 'material-ui/svg-icons/hardware/keyboard-return';
import Escape from 'material-ui/svg-icons/action/exit-to-app';
import Keyboard from 'material-ui/svg-icons/hardware/keyboard';
import CapsLock from 'material-ui/svg-icons/hardware/keyboard-capslock';
import Spacebar from 'material-ui/svg-icons/editor/space-bar';
import Warning from 'material-ui/svg-icons/alert/warning';
import { shallow, ShallowWrapper } from 'enzyme';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

type KeyboardKeyWrapper = ShallowWrapper<KeyboardKeyProps, void>;

injectTapEventPlugin();

const options: any = {
    context: {
        muiTheme: getMuiTheme()
    }
};

describe('KeyboardKey', () => {
    describe('when rendering', () => {
        describe('common for all KeyboardKeys', () => {
            let wrapper: KeyboardKeyWrapper;

            beforeEach(() => {
                const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                wrapper = shallow<KeyboardKeyProps, void>(
                    <KeyboardKey
                        keyboardKey=" "
                        onKeyPress={onKeyPress}
                        keyboardKeySymbolSize={20}
                        keyboardKeyHeight={40}
                        keyboardKeyWidth={70}
                        disableEffects={false} />,
                    options
                );
            });

            it('renders primary FlatButton', () => {
                expect(wrapper.is(FlatButton)).toBeTruthy();
                expect(wrapper.prop('primary')).toBeTruthy();
            });

            it('has onTouchTap handler', () => {
                expect(typeof wrapper.prop('onTouchTap')).toBe('function');
            });

            it('has keyboardKeyHeight for style.height', () => {
                expect(wrapper.prop('style').height).toEqual(40);
            });

            it('has keyboardKeyWidth for style.width', () => {
                expect(wrapper.prop('style').width).toEqual(70);
            });

            it('has keyboardKeyWidth for style.minWidth', () => {
                expect(wrapper.prop('style').width).toEqual(70);
            });

            it('has enabled disableFocusRipple, disableKeyboardFocus, disableTouchRipple', () => {
                expect(wrapper.prop('disableFocusRipple')).toBe(false);
                expect(wrapper.prop('disableKeyboardFocus')).toBe(false);
                expect(wrapper.prop('disableTouchRipple')).toBe(false);
            });
        });
        describe('disableEffects', () => {
            it('has special effects when disableEffects is false', () => {
                const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                const wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                    <KeyboardKey
                        keyboardKey=" "
                        onKeyPress={onKeyPress}
                        keyboardKeySymbolSize={20}
                        keyboardKeyHeight={40}
                        keyboardKeyWidth={70}
                        disableEffects={false} />,
                    options
                );

                expect(wrapper.prop('disableFocusRipple')).toBe(false);
                expect(wrapper.prop('disableKeyboardFocus')).toBe(false);
                expect(wrapper.prop('disableTouchRipple')).toBe(false);
                expect(wrapper.prop('hoverColor')).toBeUndefined();
            });

            it('has no special effects when disableEffects is true', () => {
                const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                const wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                    <KeyboardKey
                        keyboardKey=" "
                        onKeyPress={onKeyPress}
                        keyboardKeySymbolSize={20}
                        keyboardKeyHeight={40}
                        keyboardKeyWidth={70}
                        disableEffects />,
                    options
                );

                expect(wrapper.prop('disableFocusRipple')).toBe(true);
                expect(wrapper.prop('disableKeyboardFocus')).toBe(true);
                expect(wrapper.prop('disableTouchRipple')).toBe(true);
                expect(wrapper.prop('hoverColor')).toBe(options.context.muiTheme.flatButton.color);
            });
        });
        describe('when keyboardKey.length less than or equal to 1 and is not \' \'', () => {
            describe('common for all when keyboardKey.length less than or equal to 1 and is not \' \'', () => {
                let wrapper: KeyboardKeyWrapper;

                beforeEach(() => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    wrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="Y"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                });

                it('has keyboardKeySymbolSize for labelStyle.fontSize', () => {
                    expect(wrapper.prop('labelStyle').fontSize).toBe(20);
                });

                it('has \'none\' for labelStyle.textTransform', () => {
                    expect(wrapper.prop('labelStyle').textTransform).toBe('none');
                });
            });

            describe('when keyboardKey.length is 1', () => {
                it('has keyboardKey for label', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="f"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('label')).toBe('f');
                });
            });

            describe('when keyboardKey.length is less tnan 1', () => {
                let wrapper: KeyboardKeyWrapper;

                beforeEach(() => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    wrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey=""
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                });

                it('is disabled', () => {
                    expect(wrapper.prop('disabled')).toBeTruthy();
                });

                it('has \' \' for a label', () => {
                    expect(wrapper.prop('label')).toBe(' ');
                });
            });
        });

        describe('when keyboardKey.length is greater than 1 or keyboardKey is \' \'', () => {
            describe('common for all when keyboardKey.length is greater than 1 or keyboardKey is \' \'', () => {
                let wrapper: KeyboardKeyWrapper;

                beforeEach(() => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    wrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="Enter"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                });

                it('has keyboardKeySymbolSize for icon.props.style.width', () => {
                    expect(wrapper.prop('icon').props.style.width).toBe(20);
                });

                it('has keyboardKeySymbolSize for icon.props.style.height', () => {
                    expect(wrapper.prop('icon').props.style.height).toBe(20);
                });
            });

            describe('when keyboardKey is \'Enter\'', () => {
                it('has Enter for icon', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="Enter"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('icon').type).toBe(Enter);
                });
            });

            describe('when keyboardKey is \'Backspace\'', () => {
                it('has Backspace for icon', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="Backspace"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('icon').type).toBe(Backspace);
                });
            });

            describe('when keyboardKey is \'Escape\'', () => {
                it('has Escape for icon', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="Escape"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('icon').type).toBe(Escape);
                });
            });

            describe('when keyboardKey is \'CapsLock\'', () => {
                it('has CapsLock for icon', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="CapsLock"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('icon').type).toBe(CapsLock);
                });
            });

            describe('when keyboardKey is \'Keyboard\'', () => {
                it('has Keyboard for icon', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="Keyboard"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('icon').type).toBe(Keyboard);
                });
            });

            describe('when keyboardKey is \' \'', () => {
                it('has Spacebar for icon', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey=" "
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('icon').type).toBe(Spacebar);
                });
            });

            describe('when keyboardKey is not recognized', () => {
                it('has Warning for icon', () => {
                    const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    let wrapper: KeyboardKeyWrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="Some"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={20}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70}
                            disableEffects />,
                        options
                    );
                    expect(wrapper.prop('icon').type).toBe(Warning);
                });
            });
        });
    });

    describe('when shouldComponentUpdate and once touchTap-ed', () => {
        let onKeyPress: jest.Mock<KeyboardKeyPressHandler>;
        let wrapper: KeyboardKeyWrapper;
        
        beforeEach(() => {
            onKeyPress = jest.fn<KeyboardKeyPressHandler>();
            wrapper = shallow<KeyboardKeyProps, void>(
                <KeyboardKey
                    keyboardKey="i"
                    onKeyPress={onKeyPress}
                    keyboardKeySymbolSize={16}
                    keyboardKeyHeight={40}
                    keyboardKeyWidth={70}
                    disableEffects />,
                options
            );
        });

        describe('when touchTaped', () => {
            describe('when keyboardKey length is 1 or it is a supported special key', () => {
                it('calls onKeyPress with keyboardKey', () => {
                    wrapper.simulate('touchTap');
                    expect(onKeyPress).lastCalledWith('i');
                    wrapper.setProps({
                        keyboardKey: 'Enter',
                        onKeyPress: onKeyPress,
                        keyboardKeySymbolSize: 16,
                        keyboardKeyHeight :40,
                        keyboardKeyWidth: 70,
                        disableEffects: false
                    });
                    wrapper.simulate('touchTap');
                    expect(onKeyPress).lastCalledWith('Enter');
                });
            });

            describe('when keyboardKey is not recognized and supported', () => {
                it('dose not call onKeyPress', () => {
                    wrapper.setProps({
                        keyboardKey: 'TS',
                        onKeyPress: onKeyPress,
                        keyboardKeySymbolSize: 16,
                        keyboardKeyHeight :40,
                        keyboardKeyWidth: 70,
                        disableEffects: false
                    });
                    wrapper.simulate('touchTap');
                    expect(onKeyPress).not.toBeCalled();
                });
            });
        });

        describe('when shouldComponentUpdate', () => {
            it('re-renders when keyboardKey changes', () => {
                expect(wrapper.prop('label')).toEqual('i');
                wrapper.setProps({
                    keyboardKey: 's',
                    onKeyPress: onKeyPress,
                    keyboardKeySymbolSize: 16,
                    keyboardKeyHeight: 40,
                    keyboardKeyWidth: 70,
                    disableEffects: false
                });
                expect(wrapper.prop('label')).toEqual('s');
            });

            it('re-renders when onKeyPress changes', () => {
                const changedHandler: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                wrapper.simulate('touchTap');
                expect(onKeyPress).toBeCalledWith('i');
                wrapper.setProps({
                    keyboardKey: 'i',
                    onKeyPress: changedHandler,
                    keyboardKeySymbolSize: 16,
                    keyboardKeyHeight: 40,
                    keyboardKeyWidth: 70,
                    disableEffects: false
                });
                wrapper.simulate('touchTap');
                expect(changedHandler).toBeCalledWith('i');
                expect(onKeyPress.call.length).toEqual(1);
            });

            it('re-renders when keyboardKeySymbolSize changes', () => {
                expect(wrapper.prop('labelStyle').fontSize).toEqual(16);
                wrapper.setProps({
                    keyboardKey: 'i',
                    onKeyPress: onKeyPress,
                    keyboardKeySymbolSize: 20,
                    keyboardKeyHeight: 40,
                    keyboardKeyWidth: 70,
                    disableEffects: false
                });
                expect(wrapper.prop('labelStyle').fontSize).toEqual(20);
            });

            it('re-renders when keyboardKeyHeight changes', () => {
                expect(wrapper.prop('style').height).toEqual(40);
                wrapper.setProps({
                    keyboardKey: 'i',
                    onKeyPress: onKeyPress,
                    keyboardKeySymbolSize: 16,
                    keyboardKeyHeight: 50,
                    keyboardKeyWidth: 70,
                    disableEffects: false
                });
                expect(wrapper.prop('style').height).toEqual(50);
            });

            it('re-renders when keyboardKeyWidth changes', () => {
                expect(wrapper.prop('style').width).toEqual(70);
                wrapper.setProps({
                    keyboardKey: 'i',
                    onKeyPress: onKeyPress,
                    keyboardKeySymbolSize: 16,
                    keyboardKeyHeight: 40,
                    keyboardKeyWidth: 60,
                    disableEffects: false
                });
                expect(wrapper.prop('style').width).toEqual(60);
            });
            it('re-renders when disableEffects changes', () => {
                expect(wrapper.prop('disableFocusRipple')).toBe(true);
                wrapper.setProps({
                    keyboardKey: 'i',
                    onKeyPress: onKeyPress,
                    keyboardKeySymbolSize: 16,
                    keyboardKeyHeight: 40,
                    keyboardKeyWidth: 60,
                    disableEffects: false
                });
                expect(wrapper.prop('disableFocusRipple')).toBe(false);
            });

            it('dose not re-renders when no prop has changed', () => {
                const props: any = wrapper.props();
                wrapper.setProps({
                    keyboardKey: 'i',
                    onKeyPress: onKeyPress,
                    keyboardKeySymbolSize: 16,
                    keyboardKeyHeight: 40,
                    keyboardKeyWidth: 70,
                    disableEffects: true
                });
                expect(wrapper.props()).toBe(props);
            });
        });
    });
});
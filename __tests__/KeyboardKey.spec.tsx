import { KeyboardKey, KeyboardKeyProps, KeyboardKeyPressHandler } from './../src/KeyboardKey';
import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

type KeyboardKeyWrapper = ShallowWrapper<KeyboardKeyProps, void>;

injectTapEventPlugin();

describe('KeyboardKey', function () {
    describe('once rendered', function () {

        describe('when shouldComponentUpdate and once touchtaped', function () {
            const onKeyPress: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                let wrapper: KeyboardKeyWrapper;

                beforeEach(function () {
                    wrapper = shallow<KeyboardKeyProps, void>(
                        <KeyboardKey
                            keyboardKey="i"
                            onKeyPress={onKeyPress}
                            keyboardKeySymbolSize={16}
                            keyboardKeyHeight={40}
                            keyboardKeyWidth={70} />
                    );
                });

            describe('when touchtaped', function () {
                it('calls onKeyPress with keyboardKey', function () {
                    wrapper.simulate('touchTap');
                    expect(onKeyPress).toBeCalledWith('i');
                });
            });

            describe('when shouldComponentUpdate', function () {
                it('re-renders when keyboardKey changes', function () {
                    expect(wrapper.prop('label')).toEqual('i');
                    wrapper.setProps({
                        keyboardKey: 's',
                        onKeyPress: onKeyPress,
                        keyboardKeySymbolSize: 16,
                        keyboardKeyHeight: 40,
                        keyboardKeyWidth: 70
                    });
                    expect(wrapper.prop('label')).toEqual('s');
                });

                it('re-renders when onKeyPress changes', function () {
                    const changedHandler: jest.Mock<KeyboardKeyPressHandler> = jest.fn<KeyboardKeyPressHandler>();
                    wrapper.simulate('touchTap');
                    expect(onKeyPress).toBeCalledWith('i');
                    wrapper.setProps({
                        keyboardKey: 'i',
                        onKeyPress: changedHandler,
                        keyboardKeySymbolSize: 16,
                        keyboardKeyHeight: 40,
                        keyboardKeyWidth: 70
                    });
                    wrapper.simulate('touchTap');
                    expect(changedHandler).toBeCalledWith('i');
                    expect(onKeyPress.call.length).toEqual(1);
                });

                it('re-renders when keyboardKeySymbolSize changes', function () {
                    expect(wrapper.prop('labelStyle').fontSize).toEqual(16);
                    wrapper.setProps({
                        keyboardKey: 'i',
                        onKeyPress: onKeyPress,
                        keyboardKeySymbolSize: 20,
                        keyboardKeyHeight: 40,
                        keyboardKeyWidth: 70
                    });
                    expect(wrapper.prop('labelStyle').fontSize).toEqual(20);
                });

                it('re-renders when keyboardKeyHeight changes', function () {
                    expect(wrapper.prop('style').height).toEqual(40);
                    wrapper.setProps({
                        keyboardKey: 'i',
                        onKeyPress: onKeyPress,
                        keyboardKeySymbolSize: 16,
                        keyboardKeyHeight: 50,
                        keyboardKeyWidth: 70
                    });
                    expect(wrapper.prop('style').height).toEqual(50);
                });

                it('re-renders when keyboardKeyWidth changes', function () {
                    expect(wrapper.prop('style').width).toEqual(70);
                    wrapper.setProps({
                        keyboardKey: 'i',
                        onKeyPress: onKeyPress,
                        keyboardKeySymbolSize: 16,
                        keyboardKeyHeight: 40,
                        keyboardKeyWidth: 60
                    });
                    expect(wrapper.prop('style').width).toEqual(60);
                });

                it('dose not re-renders when no prop has changed', function () {
                    const props: any = wrapper.props();
                    wrapper.setProps({
                        keyboardKey: 'i',
                        onKeyPress: onKeyPress,
                        keyboardKeySymbolSize: 16,
                        keyboardKeyHeight: 40,
                        keyboardKeyWidth: 70
                    });
                    expect(wrapper.props()).toBe(props);
                });
            });
        });
    });
});
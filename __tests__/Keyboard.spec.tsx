import { Keyboard, KeyboardProps, KeyboardState, RequestCloseHandler, InputHandler, KeyboardLayout } from './../src/Keyboard';
import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { KeyboardKey, KeyboardKeyProps } from './../src/KeyboardKey';
import { extendedKeyboard, numericKeyboard } from './../src/layouts';
import EventListenerService from 'event-listener-service';
import ActiveElement from './../src/ActiveElement';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

type KeyboardShallowWrapper = ShallowWrapper<KeyboardProps, KeyboardState>;
type Listener = (eventName: string, listener: (event: any) => void, capture: boolean) => void;

injectTapEventPlugin();

describe('Keyboard', () => {
    let addListener: jest.Mock<Listener>;
    let removeListener: jest.Mock<Listener>;
    let isInput: jest.Mock<() => boolean>;
    let blur: jest.Mock<() => void>;

    beforeEach(() => {
        addListener = jest.fn<Listener>();
        removeListener = jest.fn<Listener>();
        isInput = jest.fn<() => boolean>(() => false);
        blur = jest.fn<() => void>();
        EventListenerService.setImplementation({ addListener, removeListener });
        ActiveElement.isInput = isInput;
        ActiveElement.blur = blur;
    });

    describe('when rendering', () => {
        it('undefines onChange prop for keyboard input field', () => {
            const onChange: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<TextField value="" onChange={onChange} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find(TextField).first().prop('onChange')).toBe(onChange);
            expect(wrapper.find(TextField).last().prop('onChange')).toBeUndefined();
        });

        it('undefines onFocus prop for keyboard input field and overwrites it for input when automatic', () => {
            const onFocus: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<TextField value="" onFocus={onFocus} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find(TextField).first().prop('onFocus')).not.toBe(onFocus);
            expect(typeof wrapper.find(TextField).first().prop('onFocus')).toBe('function');
            expect(wrapper.find(TextField).last().prop('onFocus')).toBeUndefined();
        });

        it('undefines onFocus prop for keyboard input field and nulls it for input when not automatic and opened', () => {
            const onFocus: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    open
                    textField={<TextField value="" onFocus={onFocus} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find(TextField).first().prop('onFocus')).not.toBe(onFocus);
            expect(wrapper.find(TextField).first().prop('onFocus')).toBeNull();
            expect(wrapper.find(TextField).last().prop('onFocus')).toBeUndefined();
        });

        it('undefines onFocus prop for keyboard input field', () => {
            const onFocus: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    textField={<TextField value="" onFocus={onFocus} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find(TextField).first().prop('onFocus')).toBe(onFocus);
            expect(wrapper.find(TextField).last().prop('onFocus')).toBeUndefined();
        });

        it('undefines onBlur prop for keyboard input field', () => {
            const onBlur: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<TextField value="" onBlur={onBlur} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find(TextField).first().prop('onBlur')).toBe(onBlur);
            expect(wrapper.find(TextField).last().prop('onBlur')).toBeUndefined();
        });

        it('undefines onKeyUp prop for keyboard input field', () => {
            const onKeyUp: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<input value="" onKeyUp={onKeyUp} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find('input').first().prop('onKeyUp')).toBe(onKeyUp);
            expect(wrapper.find('input').last().prop('onKeyUp')).toBeUndefined();
        });

        it('undefines onKeyDown prop for keyboard input field', () => {
            const onKeyDown: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<TextField value="" onKeyDown={onKeyDown} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find(TextField).first().prop('onKeyDown')).toBe(onKeyDown);
            expect(wrapper.find(TextField).last().prop('onKeyDown')).toBeUndefined();
        });

        it('undefines onKeyPress prop for keyboard input field', () => {
            const onKeyPress: () => void = (): void => { };
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<input value="" onKeyPress={onKeyPress} />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(wrapper.find('input').first().prop('onKeyPress')).toBe(onKeyPress);
            expect(wrapper.find('input').last().prop('onKeyPress')).toBeUndefined();
        });

        it('generates keyboard key for each key in the current layout', () => {
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<input value="" />}
                    layouts={[extendedKeyboard]} />
                , { lifecycleExperimental: true }
            );
            expect(extendedKeyboard.every((row: Array<string>): boolean => row.every((key: string): boolean => wrapper.find({ keyboardKey: key.match(/\ +/) === null ? key : ' ' }).length >= 1))).toBe(true);
        });

        it('transfers keyboardKey props to every keyboard key from current layout', () => {
            const wrapper: KeyboardShallowWrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={<input value="" />}
                    layouts={[extendedKeyboard]}
                    keyboardKeyHeight={30}
                    keyboardKeyWidth={60}
                    keyboardKeySymbolSize={20} />
                , { lifecycleExperimental: true }
            );
            extendedKeyboard.forEach((row: Array<string>): void => row.forEach((key: string): void => {
                const isNotSpacebar: boolean = key.match(/\ +/) === null;
                const wrappedKey: ShallowWrapper<KeyboardKeyProps, void> = wrapper.find({ keyboardKey: isNotSpacebar ? key : ' ' }).first();
                expect(wrappedKey.prop('keyboardKeyHeight')).toBe(30);
                isNotSpacebar ? expect(wrappedKey.prop('keyboardKeyWidth')).toBe(60) : expect(wrappedKey.prop('keyboardKeyWidth')).toBeGreaterThan(60);
                expect(wrappedKey.prop('keyboardKeySymbolSize')).toBe(20);
            }));
        });
    });

    describe('once mounted', () => {
        const textField: JSX.Element = <TextField value="new" />;
        const layouts: KeyboardLayout[] = [extendedKeyboard];
        let wrapper: KeyboardShallowWrapper;

        beforeEach(() => {
            wrapper = shallow<KeyboardProps, KeyboardState>(
                <Keyboard
                    automatic
                    textField={textField}
                    layouts={layouts} />
                , { lifecycleExperimental: true }
            );
        });

        describe('componentDidMount', () => {
            it('adds event listener for resize', () => {
                expect(addListener).toBeCalled();
                const args: any[] = addListener.mock.calls[0];
                expect(args[0]).toBe('resize');
                expect(typeof args[1]).toBe('function');
                expect(args[2]).toBe(false);
            });

            it('syncs values', () => {
                expect(wrapper.state('value')).toBe('new');
            });
        });

        describe('shouldComponentUpdate', () => {
            it('should re-render when state.value changes', () => {
                expect(wrapper.state('value')).toBe('new');
                wrapper.setState({ value: 'old' });
                expect(wrapper.state('value')).toBe('old');
            });

            it('should re-render when state.open changes', () => {
                expect(wrapper.state('open')).toBe(false);
                wrapper.setState({ open: true });
                expect(wrapper.state('open')).toBe(true);
            });

            it('should re-render when state.capsLock changes', () => {
                expect(wrapper.state('capsLock')).toBe(false);
                wrapper.setState({ capsLock: true });
                expect(wrapper.state('capsLock')).toBe(true);
            });

            it('should re-render when state.layout changes', () => {
                wrapper.setProps({ textField: textField, layouts: [extendedKeyboard, numericKeyboard] });
                expect(wrapper.state('layout')).toBe(0);
                wrapper.setState({ layout: 1 });
                expect(wrapper.state('layout')).toBe(1);
            });

            it('should re-render when props.open changes', () => {
                wrapper.setProps({ textField: textField, layouts: layouts, automatic: false });
                expect(wrapper.find(Dialog).prop('open')).toBe(false);
                wrapper.setProps({ textField: textField, layouts: layouts, open: true });
                expect(wrapper.find(Dialog).prop('open')).toBe(true);
            });

            it('should re-render when props.keyboardKeyHeight changes', () => {
                wrapper.setProps({ textField: textField, layouts: layouts, keyboardKeyHeight: 24 });
                expect(wrapper.find(KeyboardKey).first().prop('keyboardKeyHeight')).toBe(24);
                wrapper.setProps({ textField: textField, layouts: layouts, keyboardKeyHeight: 32 });
                expect(wrapper.find(KeyboardKey).first().prop('keyboardKeyHeight')).toBe(32);
            });

            it('should re-render when props.keyboardKeySymbolSize changes', () => {
                wrapper.setProps({ textField: textField, layouts: layouts, keyboardKeySymbolSize: 24 });
                expect(wrapper.find(KeyboardKey).first().prop('keyboardKeySymbolSize')).toBe(24);
                wrapper.setProps({ textField: textField, layouts: layouts, keyboardKeySymbolSize: 32 });
                expect(wrapper.find(KeyboardKey).first().prop('keyboardKeySymbolSize')).toBe(32);
            });

            it('should re-render when props.keyboardKeyWidth changes', () => {
                wrapper.setProps({ textField: textField, layouts: layouts, keyboardKeyWidth: 24 });
                expect(wrapper.find(KeyboardKey).first().prop('keyboardKeyWidth')).toBe(24);
                wrapper.setProps({ textField: textField, layouts: layouts, keyboardKeyWidth: 32 });
                expect(wrapper.find(KeyboardKey).first().prop('keyboardKeyWidth')).toBe(32);
            });

            it('should re-render when props.automatic changes', () => {
                expect(wrapper.state('open')).toBe(false);
                expect(wrapper.find(Dialog).prop('open')).toBe(false);
                wrapper.setState({ open: true });
                expect(wrapper.state('open')).toBe(true);
                expect(wrapper.find(Dialog).prop('open')).toBe(true);
                wrapper.setProps({ textField: textField, layouts: layouts, open: false });
                expect(wrapper.state('open')).toBe(true);
                expect(wrapper.find(Dialog).prop('open')).not.toBe(false);
                wrapper.setProps({ textField: textField, layouts: layouts, automatic: false });
                wrapper.setProps({ textField: textField, layouts: layouts, open: false });
                expect(wrapper.state('open')).toBe(true);
                expect(wrapper.find(Dialog).prop('open')).toBe(false);
            });

            it('should re-render when props.correctorName changes', () => {
                const corrector: jest.Mock<(value: string) => void> = jest.fn<(value: string) => void>();
                wrapper.setProps({
                    automatic: true,
                    textField: textField,
                    layouts: layouts,
                    correctorName: 'onRequestChange',
                    corrector: corrector
                });
                wrapper.find(TextField).last().simulate('RequestChange', 'old');
                expect(corrector).toBeCalledWith('old');
                corrector.mockClear();
                wrapper.setProps({
                    automatic: true,
                    textField: textField,
                    layouts: layouts,
                    correctorName: 'onPleaseChange',
                    corrector: corrector
                });
                wrapper.find(TextField).last().simulate('PleaseChange', 'please');
                expect(corrector).toBeCalledWith('please');
            });

            it('should re-render when props.corrector changes', () => {
                const corrector1: jest.Mock<(value: string) => void> = jest.fn<(value: string) => void>();
                const corrector2: jest.Mock<(value: string) => void> = jest.fn<(value: string) => void>();
                wrapper = shallow<KeyboardProps, KeyboardState>(
                    <Keyboard
                        automatic
                        textField={textField}
                        layouts={layouts}
                        correctorName="onRequestChange"
                        corrector={corrector1} />
                    , { lifecycleExperimental: true }
                );
                wrapper.find(TextField).last().simulate('RequestChange', 'correct1');
                expect(corrector1).toBeCalledWith('correct1');
                wrapper.setProps({
                    automatic: true,
                    textField: textField,
                    layouts: layouts,
                    correctorName: 'onRequestChange',
                    corrector: corrector2
                });
                wrapper.find(TextField).last().simulate('RequestChange', 'correct2');
                expect(corrector1).not.toBeCalledWith('correct2');
                expect(corrector2).toBeCalledWith('correct2');
            });

            it('should re-render when props.onInput', () => {
                const onInput1:jest.Mock<InputHandler> = jest.fn<InputHandler>();
                const onInput2:jest.Mock<InputHandler> = jest.fn<InputHandler>();
                const keydownEvent: any = {
                    key: 'Enter',
                    stopImmediatePropagation: jest.fn(),
                    stopPropagation: jest.fn(),
                    preventDefault: jest.fn()
                };
                wrapper.setProps({ automatic: true, textField: textField, layouts: layouts, onInput: onInput1 });
                wrapper.setState({ open: true });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onInput1).toBeCalledWith('new');
                wrapper.setProps({ automatic: true, textField: textField, layouts: layouts, onInput: onInput2 });
                wrapper.setState({ open: true, value: 'old' });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onInput1).not.toBeCalledWith('old');
                expect(onInput2).toBeCalledWith('old');
            });

            it('should re-render when props.onRequestClose', () => {
                const onRequestClose1:jest.Mock<RequestCloseHandler> = jest.fn<RequestCloseHandler>();
                const keydownEvent: any = {
                    key: 'Escape',
                    stopImmediatePropagation: jest.fn(),
                    stopPropagation: jest.fn(),
                    preventDefault: jest.fn()
                };
                wrapper.setProps({ textField: textField, layouts: layouts, automatic: false, open: true });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onRequestClose1).not.toBeCalled();
                onRequestClose1.mockClear();
                wrapper.setProps({ textField: textField, layouts: layouts, onRequestClose: onRequestClose1, automatic: false, open: true });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onRequestClose1).toBeCalled();
            });

            it('should re-render when textField.type changes', () => {
                expect(wrapper.find(TextField).length >= 2).toBe(true);
                wrapper.setProps({ automatic: true, layouts: layouts, textField: <input value="new" /> });
                expect(wrapper.find(TextField).length).toBe(0);
                expect(wrapper.find('input').length >= 2).toBe(true);
            });

            it('should re-render when props.layouts changes', () => {
                expect(wrapper.find({ keyboardKey: 'a' }).length).toBe(1);
                wrapper.setProps({ automatic: true, textField: textField, layouts: [numericKeyboard] });
                expect(wrapper.find({ keyboardKey: 'a' }).length).toBe(0);
            });

            it('should re-render when textField.props changes', () => {
                expect(wrapper.find(TextField).first().prop('value')).toBe('new');
                wrapper.setProps({ automatic: true, layouts: layouts, textField: <TextField value="old" />});
                expect(wrapper.find(TextField).first().prop('value')).toBe('old');
            });
        });

        describe('componentWillReciveProps', () => {
            it('syncs values if they differ', () => {
                expect(wrapper.state('value')).toBe('new');
                wrapper.setProps({ textField: textField, layouts: layouts });
                expect(wrapper.state('value')).toBe('new');
                wrapper.setProps({ textField: <TextField value="old" />, layouts: layouts });
                expect(wrapper.state('value')).toBe('old');
                wrapper.setProps({ textField: textField, layouts: layouts });
                expect(wrapper.state('value')).toBe('new');
            });
        });

        describe('componentDidUpdate', () => {
            describe('when automatic', () => {
                describe('when state.open changes to true', () => {
                    beforeEach(() => {
                        wrapper.setState({ open: true });
                    });

                    describe('when ActiveElement.isInput', () => {
                        it('ActiveElement.blur()s', () => {
                            wrapper.setState({ open: false });
                            isInput.mockReturnValueOnce(true);
                            wrapper.setState({ open: true });
                            expect(blur).toBeCalled();
                        });
                    });

                    describe('when ActiveElement is not input', () => {
                        it('dose not call ActiveElement.blur', () => {
                            expect(blur).not.toBeCalled();
                        });
                    });

                    it('tests if ActiveElement.isInput', () => {
                        expect(isInput).toBeCalled();
                    });

                    it('adds listener for global keydown event', () => {
                        expect(addListener).toBeCalled();
                        const { calls } = addListener.mock;
                        const args: any[] = calls[calls.length - 1];
                        expect(args[0]).toBe('keydown');
                        expect(typeof args[1]).toBe('function');
                        expect(args[2]).toBe(true);
                    });
                });

                describe('when state.open changes from true to false', () => {
                    beforeEach(() => {
                        wrapper.setState({ open: true });
                        wrapper.setState({ open: false });
                    });

                    it('removes listener for global keydown event', () => {
                        wrapper.setState({ open: false });
                        expect(removeListener).toBeCalled();
                        const { calls } = removeListener.mock;
                        const args: any[] = calls[calls.length - 1];
                        expect(args[0]).toBe('keydown');
                        expect(typeof args[1]).toBe('function');
                        expect(args[2]).toBe(true);
                    });
                });
            });

            describe('when not automatic', () => {
                beforeEach(() => {
                    wrapper = shallow<KeyboardProps, KeyboardState>(
                        <Keyboard
                            open={false}
                            textField={textField}
                            layouts={layouts} />
                        , { lifecycleExperimental: true }
                    );
                });

                describe('when props.open changes to true', () => {
                    beforeEach(() => {
                        wrapper.setProps({ textField: textField, layouts: layouts, open: true });
                    });

                    describe('when ActiveElement.isInput', () => {
                        it('ActiveElement.blur()s', () => {
                            wrapper.setProps({ textField: textField, layouts: layouts, open: false });
                            isInput.mockReturnValueOnce(true);
                            wrapper.setProps({ textField: textField, layouts: layouts, open: true });
                            expect(blur).toBeCalled();
                        });
                    });

                    describe('when ActiveElement is not input', () => {
                        it('dose not call ActiveElement.blur', () => {
                            expect(blur).not.toBeCalled();
                        });
                    });

                    it('tests if ActiveElement.isInput', () => {
                        expect(isInput).toBeCalled();
                    });

                    it('adds listener for global keydown event', () => {
                        expect(addListener).toBeCalled();
                        const { calls } = addListener.mock;
                        const args: any[] = calls[calls.length - 1];
                        expect(args[0]).toBe('keydown');
                        expect(typeof args[1]).toBe('function');
                        expect(args[2]).toBe(true);
                    });
                });

                describe('when props.open changes from true to false', () => {
                    it('removes listener for global keydown event', () => {
                        wrapper.setProps({ textField: textField, layouts: layouts, open: true });
                        wrapper.setProps({ textField: textField, layouts: layouts, open: false });
                        expect(removeListener).toBeCalled();
                        const { calls } = removeListener.mock;
                        const args: any[] = calls[calls.length - 1];
                        expect(args[0]).toBe('keydown');
                        expect(typeof args[1]).toBe('function');
                        expect(args[2]).toBe(true);
                    });
                });
            });
        });

        describe('componentWillUnmount', () => {
            it('removes resize event listner', () => {
                wrapper.unmount();
                expect(removeListener).toBeCalled();
                const args: any[] = removeListener.mock.calls[0];
                expect(args[0]).toBe('resize');
                expect(typeof args[1]).toBe('function');
                expect(args[2]).toBe(false);
            });
        });

        describe('onKeyboard', () => {
            beforeEach(() => wrapper.find(TextField).first().simulate('focus'));

            describe('when Enter is recived', () => {
                let onInput: jest.Mock<InputHandler>;

                beforeEach(() => {
                    onInput = jest.fn<InputHandler>();
                    wrapper.setProps({ textField: textField, layouts: layouts, automatic: true, onInput: onInput });
                });

                it('emits onInput and closes the Keyboard', () => {
                    expect(wrapper.find(Dialog).prop('open')).toBe(true);
                    expect(onInput).not.toBeCalled();
                    wrapper.find({ keyboardKey: 'Enter' }).shallow().simulate('touchTap');
                    wrapper.update();
                    expect(onInput).toBeCalled();
                    expect(onInput).toBeCalledWith('new');
                    expect(wrapper.find(Dialog).prop('open')).toBe(false);
                });
            });

            describe('when Backspace key is recived', () => {
                it('deletes last character as long as there are characters to be deleted', () => {
                    expect(wrapper.state('value')).toBe('new');
                    wrapper.find({ keyboardKey: 'Backspace' }).shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('ne');
                    wrapper.find({ keyboardKey: 'Backspace' }).shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('n');
                    wrapper.find({ keyboardKey: 'Backspace' }).shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('');
                    wrapper.find({ keyboardKey: 'Backspace' }).shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('');
                });
            });

            describe('when Escape key is recived', () => {
                it('closes the Keyboard', () => {
                    expect(wrapper.find(Dialog).prop('open')).toBe(true);
                    wrapper.find({ keyboardKey: 'Escape' }).shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.find(Dialog).prop('open')).toBe(false);
                });
            });

            describe('when CapsLock key is recived', () => {
                it('CapsLocks Keyboard', () => {
                    expect(wrapper.find({ keyboardKey: 'a' }).length).toBe(1);
                    expect(wrapper.find({ keyboardKey: 'A' }).length).toBe(0);
                    wrapper.find({ keyboardKey: 'CapsLock' }).first().shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.find({ keyboardKey: 'a' }).length).toBe(0);
                    expect(wrapper.find({ keyboardKey: 'A' }).length).toBe(1);
                });
            });

            describe('when Keyboard key is recived', () => {
                beforeEach(() => wrapper.setProps({ textField: textField, layouts: [[['a', 'b'], ['Keyboard', 'Enter']], [['a', 'b', 'Keyboard', 'Enter']]]  }))

                it('Changes Keyboard\'s layout', () => {
                    expect(wrapper.state('layout')).toBe(0);
                    wrapper.find({ keyboardKey: 'Keyboard' }).first().shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.state('layout')).toBe(1);
                });

                it('should make circular layout changes', () => {
                    expect(wrapper.state('layout')).toBe(0);
                    wrapper.find({ keyboardKey: 'Keyboard' }).first().shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.state('layout')).toBe(1);
                    wrapper.find({ keyboardKey: 'Keyboard' }).first().shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.state('layout')).toBe(0);
                });
            });

            describe('when symbol key is pressed', () => {
                it('should add character to value', () => {
                    expect(wrapper.state('value')).toBe('new');
                    wrapper.find({ keyboardKey: '@' }).first().shallow().simulate('touchTap');
                    expect(wrapper.state('value')).toBe('new@');
                    wrapper.find({ keyboardKey: 't' }).first().shallow().simulate('touchTap');
                    expect(wrapper.state('value')).toBe('new@t');
                    wrapper.find({ keyboardKey: 's' }).first().shallow().simulate('touchTap');
                    expect(wrapper.state('value')).toBe('new@ts');
                    wrapper.find({ keyboardKey: '#' }).first().shallow().simulate('touchTap');
                    expect(wrapper.state('value')).toBe('new@ts#');
                    wrapper.find({ keyboardKey: '9' }).first().shallow().simulate('touchTap');
                    expect(wrapper.state('value')).toBe('new@ts#9');
                });
            });

            describe('when not supported Special Key is pressed', () => {
                it('dose not do anything', () => {
                    wrapper.setProps({ textField: textField, layouts: [[['TS']]]  });
                    const props: KeyboardProps = wrapper.props();
                    const state: KeyboardState = wrapper.state();
                    wrapper.find({ keyboardKey: 'TS' }).first().shallow().simulate('touchTap');
                    wrapper.update();
                    expect(wrapper.props()).toBe(props);
                    expect(wrapper.state()).toBe(state);
                });
            });
        });

        describe('onKeyDown', () => {
            beforeEach(() => wrapper.find(TextField).first().simulate('focus'));

            describe('when Enter is recived', () => {
                let onInput: jest.Mock<InputHandler>;

                beforeEach(() => {
                    onInput = jest.fn<InputHandler>();
                    wrapper.setProps({ textField: textField, layouts: layouts, automatic: true, onInput: onInput });
                });

                it('emits onInput and closes the Keyboard when <Enter> is pressed', () => {
                    const keydownEvent: any = {
                        key: 'Enter',
                        stopImmediatePropagation: jest.fn(),
                        stopPropagation: jest.fn(),
                        preventDefault: jest.fn()
                    };
                    expect(wrapper.find(Dialog).prop('open')).toBe(true);
                    expect(onInput).not.toBeCalled();
                    EventListenerService.emit('keydown', keydownEvent);
                    wrapper.update();
                    expect(onInput).toBeCalled();
                    expect(onInput).toBeCalledWith('new');
                    expect(wrapper.find(Dialog).prop('open')).toBe(false);
                });
            });

            describe('when Backspace key is recived', () => {
               it('deletes last character as long as there are characters to be deleted when <backspace> is pressed', () => {
                   const keydownEvent: any = {
                        key: 'Backspace',
                        stopImmediatePropagation: jest.fn(),
                        stopPropagation: jest.fn(),
                        preventDefault: jest.fn()
                    };
                    expect(wrapper.state('value')).toBe('new');
                    EventListenerService.emit('keydown', keydownEvent);
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('ne');
                    EventListenerService.emit('keydown', keydownEvent);
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('n');
                    EventListenerService.emit('keydown', keydownEvent);
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('');
                    EventListenerService.emit('keydown', keydownEvent);
                    wrapper.update();
                    expect(wrapper.state('value')).toBe('');
                });
            });

            describe('when Escape key is recived', () => {
                it('closes the Keyboard when <Esc> is pressed', () => {
                    const keydownEvent: any = {
                        key: 'Escape',
                        stopImmediatePropagation: jest.fn(),
                        stopPropagation: jest.fn(),
                        preventDefault: jest.fn()
                    };
                    expect(wrapper.find(Dialog).prop('open')).toBe(true);
                    EventListenerService.emit('keydown', keydownEvent);
                    wrapper.update();
                    expect(wrapper.find(Dialog).prop('open')).toBe(false);
                });
            });

            describe('when CapsLock key is recived', () => {
                it('CapsLocks Keyboard when <CapsLock> is pressed', () => {
                    const keydownEvent: any = {
                        key: 'CapsLock',
                        stopImmediatePropagation: jest.fn(),
                        stopPropagation: jest.fn(),
                        preventDefault: jest.fn()
                    };
                    expect(wrapper.find({ keyboardKey: 'a' }).length).toBe(1);
                    expect(wrapper.find({ keyboardKey: 'A' }).length).toBe(0);
                    EventListenerService.emit('keydown', keydownEvent);
                    wrapper.update();
                    expect(wrapper.find({ keyboardKey: 'a' }).length).toBe(0);
                    expect(wrapper.find({ keyboardKey: 'A' }).length).toBe(1);
                });
            });

            describe('when symbol key is pressed', () => {
                it('should add character to value', () => {
                    let keydownEvent: any = {
                        key: '@',
                        stopImmediatePropagation: jest.fn(),
                        stopPropagation: jest.fn(),
                        preventDefault: jest.fn()
                    };
                    expect(wrapper.state('value')).toBe('new');
                    EventListenerService.emit('keydown', keydownEvent);
                    expect(wrapper.state('value')).toBe('new@');
                    keydownEvent.key = 't';
                    EventListenerService.emit('keydown', keydownEvent);
                    expect(wrapper.state('value')).toBe('new@t');
                    keydownEvent.key = 's';
                    EventListenerService.emit('keydown', keydownEvent);
                    expect(wrapper.state('value')).toBe('new@ts');
                    keydownEvent.key = '#';
                    EventListenerService.emit('keydown', keydownEvent);
                    expect(wrapper.state('value')).toBe('new@ts#');
                    keydownEvent.key = '9';
                    EventListenerService.emit('keydown', keydownEvent);
                    expect(wrapper.state('value')).toBe('new@ts#9');
                });
            });

            describe('when not supported Special Key is pressed', () => {
                it('just stops event propagation', () => {
                    const keydownEvent: any = {
                        key: 'TS',
                        stopImmediatePropagation: jest.fn(),
                        stopPropagation: jest.fn(),
                        preventDefault: jest.fn()
                    };
                    expect(wrapper.state('value')).toBe('new');
                    EventListenerService.emit('keydown', keydownEvent);
                    expect(wrapper.state('value')).toBe('new');
                    expect(keydownEvent.stopImmediatePropagation).toBeCalled();
                    expect(keydownEvent.stopPropagation).toBeCalled();
                    expect(keydownEvent.preventDefault).not.toBeCalled();
                });
            });
        });

        describe('onResize', () => {
            function extractTransformTopHelper(transform: string): number {
                return Number(transform.match(/translate\(0, (\d+)px\)/)[1]);
            }

            beforeEach(() => wrapper.setProps({
                textField: textField,
                layouts: layouts,
                keyboardKeyHeight: 60,
                keyboardKeySymbolSize: 22
            }));

            it('decreses Keyboard with if window.innerWidth is less than needed', () => {
                const { width, maxWidth } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                const { innerWidth: oldWidth } = window;
                window.innerWidth = oldWidth / 10;
                EventListenerService.emit('resize');
                wrapper.update();
                const { width: newWidth, maxWidth: newMaxWidth } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                expect(newWidth).toBeLessThan(width);
                expect(newMaxWidth).toBeLessThan(maxWidth);
                window.innerWidth = oldWidth;
            });

            it('decreses Keyboard translate(0, top) if window.innerHeight is less than needed but greater than the need for height resize', () => {
                const { height, maxHeight, transform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                const { innerHeight: oldHeight } = window;
                window.innerHeight = (oldHeight / 2) + 50;
                EventListenerService.emit('resize');
                wrapper.update();
                const { height: newHeight, maxHeight: newMaxHeight, transform: newTransform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                expect(newHeight).toEqual(height);
                expect(newMaxHeight).toBeLessThan(maxHeight);
                expect(extractTransformTopHelper(newTransform)).toBeLessThan(extractTransformTopHelper(transform));
                window.innerHeight = oldHeight;
            });

            it('decreses Keyboard height if window.innerHeight is less than needed and sets transform to translate(0, 0)', () => {
                const { height, maxHeight, transform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                const { innerHeight: oldHeight } = window;
                window.innerHeight = oldHeight / 2;
                EventListenerService.emit('resize');
                wrapper.update();
                const { height: newHeight, maxHeight: newMaxHeight, transform: newTransform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                expect(newHeight).toBeLessThan(height);
                expect(newMaxHeight).toBeLessThan(maxHeight);
                expect(extractTransformTopHelper(newTransform)).toEqual(0);
                window.innerHeight = oldHeight;
            });

            it('decreses Keyboard size if window inners* are less than requested with keyboardKey* props', () => {
                const { width, maxWidth, height, maxHeight, transform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                const { innerHeight: oldHeight, innerWidth: oldWidth } = window;
                window.innerWidth = oldWidth / 10;
                window.innerHeight = oldHeight / 10;
                EventListenerService.emit('resize');
                wrapper.update();
                const { width: newWidth, maxWidth: newMaxWidth, height: newHeight, maxHeight: newMaxHeight, transform: newTransform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                expect(newWidth).toBeLessThan(width);
                expect(newMaxWidth).toBeLessThan(maxWidth);
                expect(newHeight).toBeLessThan(height);
                expect(newMaxHeight).toBeLessThan(maxHeight);
                expect(extractTransformTopHelper(newTransform)).toEqual(0);
                window.innerWidth = oldWidth;
                window.innerHeight = oldHeight;
            });

            it('it dose not change Keyboard with if window.innerWidth is greater than needed', () => {
                const { width, maxWidth } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                const { innerWidth: oldWidth } = window;
                window.innerWidth = oldWidth * 10;
                EventListenerService.emit('resize');
                wrapper.update();
                const { width: newWidth, maxWidth: newMaxWidth } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                expect(newWidth).toEqual(width);
                expect(newMaxWidth).toBeGreaterThan(maxWidth);
                window.innerWidth = oldWidth;
            });

            it('it dose not change Keyboard height if window.innerHeight is greater than needed', () => {
                const { height, maxHeight, transform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                const { innerHeight: oldHeight } = window;
                window.innerHeight = oldHeight * 10;
                EventListenerService.emit('resize');
                wrapper.update();
                const { height: newHeight, maxHeight: newMaxHeight, transform: newTransform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                expect(newHeight).toEqual(height);
                expect(newMaxHeight).toBeGreaterThan(maxHeight);
                expect(extractTransformTopHelper(newTransform)).toEqual(extractTransformTopHelper(transform));
                window.innerHeight = oldHeight;
            });

            it('it dose not change Keyboard size if window inners* are greater than requested with keyboardKey* props', () => {
                const { width, maxWidth, height, maxHeight, transform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                const { innerHeight: oldHeight, innerWidth: oldWidth } = window;
                window.innerWidth = oldWidth * 10;
                window.innerHeight = oldHeight * 10;
                EventListenerService.emit('resize');
                wrapper.update();
                const { width: newWidth, maxWidth: newMaxWidth, height: newHeight, maxHeight: newMaxHeight, transform: newTransform } = wrapper.find(Dialog).prop('contentStyle') as React.CSSProperties;
                expect(newWidth).toEqual(width);
                expect(newMaxWidth).toBeGreaterThan(maxWidth);
                expect(newHeight).toEqual(height);
                expect(newMaxHeight).toBeGreaterThan(maxHeight);
                expect(extractTransformTopHelper(newTransform)).toEqual(extractTransformTopHelper(transform));
                window.innerWidth = oldWidth;
                window.innerHeight = oldHeight;
            });
        });

        describe('makeCorrection', () => {
            it('corrects value', () => {
                expect(wrapper.state('value')).toBe('new');
                (wrapper.instance() as Keyboard).makeCorrection('old');
                expect(wrapper.state('value')).toBe('old');
            });
        });

        describe('when automatic', () => {
            describe('onFocus', () => {
                describe('when Keyboard.automaitcOpenPredicate return true', () => {
                    it('sets state.open to true', () => {
                        expect(wrapper.state('open')).toBe(false);
                        wrapper.find(TextField).first().simulate('focus');
                        expect(wrapper.state('open')).toBe(true);
                    });
                });

                describe('when Keyboard.automaitcOpenPredicate return false', () => {
                    it('sets state.open to true', () => {
                        Keyboard.automaitcOpenPredicate = () => false;
                        expect(wrapper.state('open')).toBe(false);
                        wrapper.find(TextField).first().simulate('focus');
                        expect(wrapper.state('open')).toBe(false);
                    });
                });
            });
        });
    });
});
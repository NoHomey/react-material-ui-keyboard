import { Keyboard, KeyboardProps, KeyboardState, RequestCloseHandler, InputHandler, KeyboardLayout } from './../src/Keyboard';
import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import { KeyboardKey, KeyboardKeyProps } from './../src/KeyboardKey';
import { extendedKeyboard, numericKeyboard } from './../src/layouts';
import EventListenerService from 'event-listener-service';
import ActiveElement from './../src/ActiveElement';

type KeyboardShallowWrapper = ShallowWrapper<KeyboardProps, KeyboardState>;
type Listener = (eventName: string, listener: (event: any) => void, capture: boolean) => void;

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
                    textField: textField,
                    layouts: layouts,
                    correctorName: 'onRequestChange',
                    corrector: corrector
                });
                wrapper.find(TextField).last().simulate('RequestChange', 'old');
                expect(corrector).toBeCalledWith('old');
                corrector.mockClear();
                wrapper.setProps({
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
                wrapper.setProps({
                    textField: textField,
                    layouts: layouts,
                    correctorName: 'onRequestChange',
                    corrector: corrector1
                });
                wrapper.find(TextField).last().simulate('RequestChange', 'correct1');
                expect(corrector1).toBeCalledWith('correct1');
                wrapper.setProps({
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
                wrapper.setProps({ textField: textField, layouts: layouts, onInput: onInput1 });
                wrapper.setState({ open: true });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onInput1).toBeCalledWith('new');
                wrapper.setProps({ textField: textField, layouts: layouts, onInput: onInput2 });
                wrapper.setState({ open: true, value: 'old' });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onInput1).not.toBeCalledWith('old');
                expect(onInput2).toBeCalledWith('old');
            });

            it('should re-render when props.onRequestClose', () => {
                const onRequestClose1:jest.Mock<RequestCloseHandler> = jest.fn<RequestCloseHandler>();
                const onRequestClose2:jest.Mock<RequestCloseHandler> = jest.fn<RequestCloseHandler>();
                const keydownEvent: any = {
                    key: 'Escape',
                    stopImmediatePropagation: jest.fn(),
                    stopPropagation: jest.fn(),
                    preventDefault: jest.fn()
                };
                wrapper.setProps({ textField: textField, layouts: layouts, onRequestClose: onRequestClose1, automatic: false, open: true });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onRequestClose1).toBeCalled();
                onRequestClose1.mockClear();
                wrapper.setProps({ textField: textField, layouts: layouts, onRequestClose: onRequestClose2 });
                EventListenerService.emit('keydown', keydownEvent);
                expect(onRequestClose1).not.toBeCalled();
                expect(onRequestClose2).toBeCalled();
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

        describe('makeCorrection', () => {
            it('corrects value', () => {
                expect(wrapper.state('value')).toBe('new');
                (wrapper.instance() as Keyboard).makeCorrection('old');
                expect(wrapper.state('value')).toBe('old');
            });
        });
    });
});
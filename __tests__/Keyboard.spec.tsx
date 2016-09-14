import { Keyboard, KeyboardProps, KeyboardState, RequestCloseHandler, InputHandler, KeyboardLayout } from './../src/Keyboard';
import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import TextField from 'material-ui/TextField';
import { extendedKeyboard } from './../src/layouts';
import EventListenerService from 'event-listener-service';

type KeyboardShallowWrapper = ShallowWrapper<KeyboardProps, KeyboardState>;
type Listener = (eventName: string, listener: (event: any) => void, capture: boolean) => void;


describe('Keyboard', () => {
    let addListener: jest.Mock<Listener>;
    let removeListener: jest.Mock<Listener>;

    beforeEach(() => {
        addListener = jest.fn<Listener>();
        removeListener = jest.fn<Listener>();
        EventListenerService.setImplementation({ addListener, removeListener });
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
            );
            (wrapper.instance() as Keyboard).componentDidMount();
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

        describe('shouldComponentUpdate', () => {
 
        });

        describe('componentDidUpdate', () => {
 
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
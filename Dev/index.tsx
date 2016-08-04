import * as React from 'react';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import Demo from './demo';

injectTapEventPlugin();
let bootstrapNode = document.createElement('div');
ReactDomRender(<Demo />, bootstrapNode);
document.body.appendChild(bootstrapNode);
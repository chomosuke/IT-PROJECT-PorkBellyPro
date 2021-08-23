import { initializeIcons } from '@fluentui/react';
import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

initializeIcons();

render(<App />, document.getElementById('app-root'));

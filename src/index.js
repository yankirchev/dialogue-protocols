import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import 'carbon-components/css/carbon-components.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

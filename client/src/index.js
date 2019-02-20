import React from 'react';
import { Router, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import 'materialize-css/dist/js/materialize.js';
import routes from './routes';

// render App component on 'root'
ReactDOM.render(<Router history={browserHistory} routes={routes} />, 
                document.getElementById('root'));
// ??
registerServiceWorker();

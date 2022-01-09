import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';

import history from '@services/history';
import thunk from 'redux-thunk';
import reducers from './reducers';

export default function configureStore() {
    return createStore(reducers, composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history))));
}

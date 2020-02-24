// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import { createStore, applyMiddleware } from '../plugins/KRedux';
import thunk from '../plugins/thunk';
import logger from '../plugins/logger';

const initState = {
    count: 0
}

function reduce(state = initState, action) {
    switch(action.type) {
        case 'ADD':
            return { count: state.count + 1 };
        case 'MINUS':
            return { count: state.count - 1 };
        default:
            return state;
    }
}

const store = createStore(reduce, applyMiddleware(logger, thunk));

export default store;
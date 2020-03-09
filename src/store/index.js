import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, call, put } from 'redux-saga/effects';

// import { createStore, applyMiddleware } from '../plugins/KRedux';
// import thunk from '../plugins/thunk';
// import logger from '../plugins/logger';

function counterRedurce(state = 0, action) {
    let num = action.ployed || 1;
    switch(action.type) {
        case 'ADD':
            return state + num;
        case 'MINUS':
            return state + num;
        default:
            return state;
    }
}

let initUser = {
    isLogin: false,
    user: {
        name: null
    }
}

function loginRedurce(state = {...initUser}, action) {
    switch(action.type) {
        case 'LOGININ_SUCCESS':
            return {
                isLogin: true,
                user: {
                    name: action.user || 'xiaoming'
                }
            };
        case 'LOGINOUT_SUCCESS':
            return {
                isLogin: false,
                user: {
                    name: null
                }
            };
        default:
            return state;
    }
}

function mockData(action) {
    return new Promise((reslove) => {
        setTimeout(() => {
            reslove({
                name: 'xiaohong'
            });
        }, 1000);
    })
}

function* loginSaga(action) {
    const user = yield call(mockData, action.type);
    
    yield put({ type: 'LOGININ_SUCCESS', user });
}

function* mySaga() {
    yield takeEvery('LOGININ', loginSaga);
}

const saga = createSagaMiddleware();

const store = createStore(combineReducers({ count: counterRedurce, login: loginRedurce }), applyMiddleware(logger, thunk, saga));

saga.run(mySaga);

export default store;
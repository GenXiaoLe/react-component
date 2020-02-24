// 参数来自于applyMiddleware方法
// thunk处理函数式的dispatch
export default function logger({ getState, dispatch }) {
    // 获取加强版dispatch会传入原始dispatch
    // dispatch接收参数action
    return dispatch => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }
        return dispatch(action);
    }
}
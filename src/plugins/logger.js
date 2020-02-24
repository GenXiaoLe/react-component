// 参数来自于applyMiddleware方法
// logger只把执行结果返回出去，其他流程正常
export default function logger({ getState, dispatch }) {
    // 获取加强版dispatch会传入原始dispatch
    // dispatch接收参数action
    return dispatch => action => {
        console.log(`${action.type}执行了`);
        return dispatch(action);
    }
}
export function createStore(reduce, enhancer) {
    if (enhancer) {
        return enhancer(createStore)(reduce);
    }

    let currentState = undefined;
    let currentListeners = [];

    // 获取state
    function getState() {
        return currentState;
    }

    // 更新数据
    function dispatch(action) {
        currentState = reduce(currentState, action);

        currentListeners.forEach(cb => {
            cb();
        })
    }

    // 监听数据
    function subscribe(listener) {
        currentListeners.push(listener);
    }

    // 获取初始值
    dispatch('init');

    return {
        getState,
        dispatch,
        subscribe
    };
}

export function applyMiddleware(...middlewares) {
    // 由于dispatch不能处理函数，需要通过中间件获得处理后的强化版dispatch，所以需要通过链式调用将基础参数注入中间件并得到最后的dispatch

    // 1 applyMiddleware() 返回 
    // createStore => (...args) => {
    //     const store = createStore(...args);
    //     return {
    //         ...store
    //     };
    // }

    // 2 enhancer(createStore) 返回
    // (...args) => {
    //     const store = createStore(...args);
    //     return {
    //         ...store
    //     };
    // }

    // 3 enhancer(createStore)(reduce) 返回
    // return {
    //     ...store
    // };

    // createStore === createStore ...args === reduce
    return createStore => (...args) => {
        const store = createStore(...args);

        // 依靠中间件获得加强版的dispatch

        // 获取基础的dispatch
        let dispatch = store.dispatch;

        // 中间件运行过程
        // 1. 调用中间件，注入基础参数 getState, dispatch
        let middlewareApi = {
            getState: store.getState,
            dispatch
        };

        // 2. 循环中间件，或得注入参数后的中间件，得到中间件数组
        const middlewaresChain = middlewares.map(middleware => middleware(middlewareApi));

        // 3. 由于那个中间件都需要用到上次一处理后的数据，middlewaresChain需要实现链式调用，并拿到最后中间件处理过后的dispatch
        dispatch = compose(...middlewaresChain)(dispatch);

        // 4. 得到强化后的dispatch 替换掉基础的dispatch
        return {
            ...store,
            dispatch
        };
    }
}

// 返回链式调用嵌套函数
function compose(...funcs) {
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}


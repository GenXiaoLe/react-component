import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { connect } from '../plugins/KReduxReact';
import { Button } from 'antd';
// import { bindActionCreators } from '../plugins/KRedux'

class ReduxReact extends Component{
    render() {
        console.log(this.props, 'pageProps');
        const { count, Add, Minus } = this.props;
        return(
            <div>
                <h3>ReduxReactPage</h3>
                <p>{count}</p>
                <Button onClick={Add}>增加</Button>
                <Button onClick={Minus}>减少</Button>
            </div>
        )
    }
}

export default connect(
    (store) => ({ count: store.count }),
    // dispatch第一种
    {
        Add: () => ({ type: 'ADD' }),
        Minus: () => ({ type: 'MINUS' })
    },
    // dispatch第二种 返回函数 使用dispatch手动绑定
    // (dispatch) => {
    //     return {
    //         Add: () => dispatch({ type: 'ADD' }),
    //         Minus: () => dispatch({ type: 'MINUS' })
    //     }
    // }
    // dispatch第三种 返回函数 使用bindActionCreators方法改造action
    // (dispatch) => {
    //     let _res = {
    //         Add: () => dispatch({ type: 'ADD' }),
    //         Minus: () => dispatch({ type: 'MINUS' })
    //     }

    //     _res = bindActionCreators(_res, dispatch)

    //     return {
    //         dispatch,
    //         ..._res
    //     }
    // }
)(ReduxReact);
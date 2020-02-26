import React, { Component } from 'react';
import { bindActionCreators } from '../plugins/KRedux';

// 构建组件Provider以及方法connect

// 实现provide
// 1.Provider中注入store connect中均能接受到store 所以需要使用React.createContext
// 2.构建React.createContext
// 3.使用createContext的Provider注入props.store

const ValueContext = React.createContext();

export class Provider extends Component {
    render() {
        const { store, children } = this.props;
        return (
            <ValueContext.Provider value={store}>
                {children}
            </ ValueContext.Provider>
        )
    }
}

// 实现connect
// 1.接收注入的上下文context中的stroe
// 第一次调用接收两个参数 返回一个高阶函数
// 2.接收第一个参数是mapStateToProps 这是一个函数 传入参数store 返回值接收一个sotre
// 3.接收第二个参数是mapDispatchToProps 这也是一个函数 传入dispatch 
// 第二次调用接收一个外部组件 返回一个包装过后的组件
// 4.在高阶函数WarpComponents中 需要把store和dispatch当作props传入
// 5.构建一个state.props 将store和dispatch存储并传入组件中
export const connect = (
    mapStateToProps = state => state,
    mapDispatchToProps
) => WarpComponents => {
    return class WarpComponent extends Component {
        // 接收上下文ValueContext
        static contextType = ValueContext;

        constructor(props) {
            super(props);
            this.state = {
                props: {}
            }
        }

        // 由于需要监听 在改变state的时候重新setState 所以需要update函数
        update = () => {
            const { getState, dispatch } = this.context;
            // 从context中取出getState 调用mapStateToProps 获取用户自己构建的store
            const stateProps = mapStateToProps(getState())
            let dispatchProps = null;

            // 判断mapDispatchToProps类型，构建dispatchProps
            if (typeof mapDispatchToProps === 'object') {
                dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
            } else if (typeof mapDispatchToProps === 'function') {
                dispatchProps = mapDispatchToProps(dispatch);
            } else {
                // 默认注入基础dispatch
                dispatchProps = { dispatch }
            }

            this.setState({
                props: {
                    ...stateProps,
                    ...dispatchProps
                }
            })
        }

        componentDidMount() {
            this.update();

            const { subscribe } = this.context;
            subscribe(() => {
                this.update();
            })
        }
        
        render() {
            return (
                <WarpComponents {...this.state.props} />
            )
        }
    }
}
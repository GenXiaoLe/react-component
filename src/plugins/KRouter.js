// 组件目标
// 实现BrowserRouter
// 1.将children传出
// 2.link需要动态更新history，利用上下文context传出
// 实现Route
// 1. 接收两个参数 path 和 component
// 2. 利用上下文接收history并动态更新组件
// 3. 利用函数生成match，匹配到的话，拼装location，mactch，context，传入并根据类型生成组件
// 4. 根据优先级children component render
// 实现Link
// 1.返回一个a标签 接收 to 和 children两个参数
// 2.为了避免a标签切换界面闪屏，点击时候利用history跳转
// 3.为了保证动态更新和一致性，使用同一个history，从父组件BrowserRouter中传下来
// 实现switch
// 1. 接收上下文，之后在path没有传入时候，接收默认match，一般404会用到 或者location，在匹配match会用到
// 2. 遍历找出匹配到的第一个元素，使用createClone返回
// 实现Redirect 

import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import matchPath from './component/matchPath';
import { RouterContext } from './component/routerContext';

class BrowserRouter extends Component {
    static computeRootMatch(pathname) {
        return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }

    constructor(props) {
        super(props);
        this.history = createBrowserHistory();
        this.state = {
            location: this.history.location
        };
        // 当history变化时候监听并改变
        this.unListen = this.history.listen(location => {
            this.setState({
                location
            })
        });
    }

    componentWillUnmount() {
        if (this.unListen) {
            this.unListen();
        }
    }

    render() {
        return (
            <RouterContext.Provider value={{
                history: this.history, 
                location: this.state.location,
                match: BrowserRouter.computeRootMatch(this.state.location.pathname)
            }}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}

class Route extends Component {
    render() {
        return (
            <RouterContext.Consumer>{
                context => {
                    const { children, component, render, computeMatch } = this.props;
                    // props中的location优先级更高
                    const location = this.props.location || context.location;
                    const match = computeMatch ? computeMatch : matchPath(location.pathname, this.props);
                    const props = {
                        ...context,
                        location,
                        match
                    };
                    // 由于存在嵌套和路由守卫之类的方式，需要  更新上下文，所以需要再包一层上下文，使他始终接受的都是上一层的上下文
                    return <RouterContext.Provider value={props}>
                        { match ? 
                        children ? typeof children === 'function' ? children(props) : children
                        : component ? React.createElement(component, props)
                        : render ? render(props) : null
                        : typeof children === 'function' ? children(props) : null }
                    </RouterContext.Provider>
                }
            }</RouterContext.Consumer>
        )
    }
}

class Link extends Component {
    handleClick = (event, history) => {
        event.preventDefault();
        history.push(this.props.to);
    }

    render() {
        const { to, children } = this.props;
        return (
            <RouterContext.Consumer>{
                context => {
                    return <a href={to} onClick={(event) => this.handleClick(event, context.history)}>{children}</a>
                }    
            }</RouterContext.Consumer>
        )
    }
}

class Switch extends Component {
    render() {
        return <RouterContext.Consumer>
            {
                context => {
                    const location = this.props.location || context.location;
                    let element, match;
                    // 拿出传入children
                    const { children } = this.props;
                    // 遍历查找第一个匹配得到的元素 也就是match不存在并且是合法dom
                    React.Children.forEach(children, child => {
                        if (match == null && React.isValidElement(child)) {
                            element = child;
                            const path = child.props.path;
                            match = path ? matchPath(location.pathname, {...child.props, path})
                                : context.match;
                        }
                    });
                    return match ? React.cloneElement(element, { location, computeMatch: match }) : null
                }
            }
        </RouterContext.Consumer>
    }
}

class Redirect extends Component {
    render() {
        return <RouterContext.Consumer>
            {
                context => {
                    const { to } = this.props;
                    const { history } = context;
                    console.log('to', to);
                    return <LifeCycle onMount={() => history.push(to)} />
                }
            }
        </RouterContext.Consumer>
    }
}

class LifeCycle extends Component {
    componentDidMount() {
        if (this.props.onMount) {
            this.props.onMount();
        }
    }

    render() {
        return null;
    }
}

export { BrowserRouter, Route, Link, Switch, Redirect };
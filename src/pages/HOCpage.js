import React, { Component } from 'react';

const Child = function(props) {
    // console.log(props, 'child');
    return <div>
        HOCpage Child
    </div>
}

const foo = (Comp) => props => {
    // console.log(props);
    return <div className="greenBorder">
        <Comp  {...props} />
    </div>
}

// 函数使用方式
const Foo = foo(Child);

// 使用装饰器必须是一个组件才可以
// @foo
class Child2 extends Component {
    render() {
        return <div>
            HOCpage Child2
        </div>
    }
}

export default class HOCpage extends Component {
    render() {
        // <Foo a={1} /> === Foo({a: 1})
        return (
            <div>
                HOCpage
                <Foo />
                <Child2 />
            </div>
        )
    }
}
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// // import { Provider } from './plugins/KReduxReact';

// import store from './store/index';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//     <Provider store={store}>
//         <App />
//     </ Provider>, 
//     document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from './plugins/KReact.fiber';
import Component from './plugins/component/components';
import ReactDOM, { useState } from './plugins/KReactDOM.fiber';

class ComponentNode extends Component {
    // 固定写法
    // 默认属性
    static defaultProps = { color: 'pink' };
    render() {
        const { color } = this.props;
        return (
            <div>
                <p>ComponentNode</p>
                <p className={color}>_defaultProps</p>
            </div>
        )
    }
}

function FunNode(props) {
    const [count, setCount] = useState(0);

    return <div>
        <button onClick={() => setCount(count + 1)}>{count}</button>
        <p>funNode</p>
    </div>
}

const jsx = <div>
                <a href="www.baidu.com">kkb</a>
                <p>kkb-text</p>
                <h3>
                    <a href="www.baidu.com">baidu</a>
                    <p>h3 baidu</p>
                </h3>
                <FunNode />
                <ComponentNode color="red" />
                <>
                    <div>fragmentNode</div>
                </>
                {/* {[1, 2, 3].map(item => {
                    return (<div key={item}>
                        <p>{item}</p>
                    </div>)
                })} */}
            </div>

ReactDOM.render(
    jsx, 
    document.getElementById('root')
);

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

import React from './plugins/KReact';
import Component from './plugins/component/components';
import ReactDOM from './plugins/KReactDOM';

class ComponentNode extends Component {
    render() {
        return (
            <div>
                ComponentNode
            </div>
        )
    }
}

function FunNode(props) {
    console.log(Component);
    return <div>funNode</div>
}

const jsx = <div>
                <a href="www.baidu.com">kkb</a>
                <p onClick={() => console.log('onclick')}>kkb-text</p>
                <h3>
                    <a href="www.baidu.com">baidu</a>
                    <p>h3 baidu</p>
                </h3>
                <FunNode />
                <ComponentNode />
                <>
                    <div>fragmentNode</div>
                </>
                {[1, 2, 3].map(item => {
                    return (<div key={item}>
                        <p>{item}</p>
                    </div>)
                })}
            </div>

ReactDOM.render(
    jsx, 
    document.getElementById('root')
);

import React, { Component } from 'react';
import store from '../store/index';
import { Button } from 'antd';

export default class RudexPage extends Component {
    componentDidMount() {
        // 用于监听state改变
        store.subscribe(() => {
            this.forceUpdate();
        })
    }

    Add = () => {
        store.dispatch({type: 'ADD'})
    }

    Minus = () => {
        store.dispatch({type: 'MINUS'})
    }

    AsyncAdd = () => {
        store.dispatch(
            (dispatch) => {
                setTimeout(() => {
                    dispatch({ type: 'ADD' });
                }, 1000);
            }
        )
    }

    render() {
        return (
            <div>
                <h3>RudexPage</h3>
                <p>{store.getState().count}</p>
                <Button onClick={this.Add}>增加</Button>
                <Button onClick={this.Minus}>减少</Button>
                <Button onClick={this.AsyncAdd}>异步增加</Button>
            </div>
        )
    }
}
import React, { Component } from 'react';
import store from '../store/index';
import { Button, Input } from 'antd';
import KFormCreate from '../plugins/Form';

export default KFormCreate(
    class RudexPage extends Component {
        componentDidMount() {
            // 用于监听state改变
            store.subscribe(() => {
                this.forceUpdate();
            })
        }

        Add = () => {
            const { getFieldValue, validateFields } = this.props;

            validateFields((error) => {
                if (Object.keys(error).length) {
                    console.log(`错误信息${JSON.stringify(error)}`);
                } else {
                    let num = getFieldValue('num');
                    store.dispatch({type: 'ADD', ployed: Number(num)});
                }
            });
        }

        Minus = () => {
            const { getFieldValue, validateFields } = this.props;

            validateFields((error) => {
                if (Object.keys(error).length) {
                    console.log(`错误信息${JSON.stringify(error)}`);
                } else {
                    let num = getFieldValue('num');
                    store.dispatch({type: 'MINUS', ployed: Number(num)});
                }
            });
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
            const { getFieldDecorator } = this.props;
            return (
                <div>
                    <h3>RudexPage</h3>
                    <p>{store.getState().count}</p>
                    {getFieldDecorator(
                        'num',
                        { rules: { required: true, type: 'string', message: 'plase input number' } }
                    )(
                        <Input type="text" />
                    )}
                    <Button onClick={this.Add}>增加</Button>
                    <Button onClick={this.Minus}>减少</Button>
                    <Button onClick={this.AsyncAdd}>异步增加</Button>
                </div>
            )
        }
    }
)
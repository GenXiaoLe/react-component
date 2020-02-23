import React, { Component } from 'react';
import { Input, Button } from 'antd';
import KFormCreate from '../plugins/Form';
import DialogPage from './dialogPage';

class FormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            isShow: false,
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    toggle = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }

    onSubmit = () => {
        const { getFieldValue, getFieldValues, validateFields } = this.props;
        let fields = getFieldValues();
        let field = getFieldValue('name');

        validateFields((error, value) => {
            if (Object.keys(error).length) {
                console.log(`错误信息${JSON.stringify(error)}`);
            } else {
                console.log(value);
            }
        });
        console.log(fields, field);
    }

    render() {
        const { getFieldDecorator } = this.props;
        return (
            <div>
                { getFieldDecorator('name', {
                    rules: {required: true, type: 'string', message: 'plase input ur name'}
                })(<Input type="text" placeholder="use name" />) }
                { getFieldDecorator('password', {
                    rules: {required: true, type: 'string', message: 'plase input ur password'}
                })(<Input type="password" placeholder="password" />) }
                <Button onClick={this.onSubmit}> 登陆 </ Button>
                <Button onClick={this.toggle}> 显示弹窗 </ Button>
                {this.state.isShow && <DialogPage />}
            </div>
        )
    }
}

export default KFormCreate(FormPage);
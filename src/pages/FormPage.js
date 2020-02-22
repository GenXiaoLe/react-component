import React, { Component } from 'react';
import { Input, Button } from 'antd';
import KFormCreate from '../plugins/Form';

class FormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
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
                    rules: {required: true, type: 'string'}
                })(<Input type="text" placeholder="use name" />) }
                { getFieldDecorator('password', {
                    rules: {required: true, type: 'string'}
                })(<Input type="password" placeholder="password" />) }
                <Button onClick={this.onSubmit}> 登陆 </ Button>
            </div>
        )
    }
}

export default KFormCreate(FormPage);
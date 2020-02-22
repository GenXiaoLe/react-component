import React, { Component } from 'react';

const kFormCeater = Comp => {
    return class Form extends Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.options = {};
            this.error = {};
        }
        handleChange = (e) => {
            let { name, value } = e.target;

            this.setState({
                [name]: value
            });
        }
        // 获取传入组件并绑定相应事件
        getFieldDecorator = (field, options) => InputComp => {
            this.options[field] = options;
            return React.cloneElement(InputComp, {
                name: field,
                value: this.state[field] || '',
                onChange: this.handleChange
            });
        }
        // 获取单个value
        getFieldValue = (field) => {
            return this.state[field];
        }
        // 获取所有value
        getFieldValues = () => {
            return {...this.state};
        }
        // 数据校验
        validateFields = (validateCallback) => {
            // 配置验证表
            const dict = {
                required: (_name) => !this.state[_name] || this.state[_name] === '',
                type: (_name, _type) => !this.state[_name] || typeof this.state[_name] !== _type
            }

            //接收一个callback，校验结束后返回error和value
            this.error = {};

            for (let name in this.options) {
                let _rules = this.options[name].rules;
                if (name && _rules) {
                    for (let item in _rules) {
                        if (_rules[item] && dict[item](name, _rules[item])) {
                            this.error[name] = `${name} is error`;
                        }
                    }
                }
            }

            validateCallback(this.error, {...this.state});
        }

        render() {
            return (
                <div>
                    <Comp getFieldDecorator={this.getFieldDecorator} getFieldValue={this.getFieldValue} getFieldValues={this.getFieldValues} validateFields={this.validateFields} />
                </div>
            )
        }
    } 
}

export default kFormCeater;
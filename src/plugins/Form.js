import React, { Component } from 'react';

const kFormCeater = Comp => {
    return class Form extends Component {
        constructor(props) {
            super(props);
            this.state = {
                error: {}
            };
            this.options = {};
        }
        handleChange = (e) => {
            let { name, value } = e.target;
            this.validateInit({
                ...this.state,
                [name]: value
            });
        }
        // 获取传入组件并绑定相应事件
        getFieldDecorator = (field, options) => InputComp => {
            this.options[field] = options;
            return <div>
                {
                    React.cloneElement(InputComp, {
                        name: field,
                        value: this.state[field] || '',
                        onChange: this.handleChange
                    })
                }
                {
                    this.state.error[field] && <p>{this.state.error[field]}</p>
                }
            </div>;
        }
        // 获取单个value
        getFieldValue = (field) => {
            return this.state[field];
        }
        // 获取所有value
        getFieldValues = () => {
            return {...this.state};
        }
        validateInit = (state) => {
            // 设置错误信息
            const error = {};
            // 配置验证表
            const dict = {
                required: (_name) => !state[_name] || state[_name] === '',
                type: (_name, _type) => !state[_name] || typeof state[_name] !== _type
            }

            //接收一个callback，校验结束后返回error和value
            for (let name in this.options) {
                let _rules = this.options[name].rules;
                if (name && _rules) {
                    for (let item in _rules) {
                        if (_rules[item] && dict[item] && dict[item](name, _rules[item])) {
                            error[name] = this.options[name].rules.message;
                        }
                    }
                }
            }

            this.setState({ 
                ...state,
                error 
            });
        }
        // 数据校验
        validateFields = (validateCallback) => {
            this.validateInit(this.state);
            validateCallback(this.state.error, {...this.state});
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
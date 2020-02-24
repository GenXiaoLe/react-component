import React, { Component } from 'react';

import { ThemeContext } from '../public/context';

export default class contextPage extends Component{
    // contextType固定语法，任何生命周期都能调用到
    static contextType = ThemeContext;

    render() {
        const { context } = this;
        return (
        <div>{context.color}</div>
        )
    }
}
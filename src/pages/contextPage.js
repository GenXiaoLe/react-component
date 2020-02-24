import React, { Component } from 'react';
import ContextType from './contextType';
import ContextConsumer from './contextConsumer';

import { ThemeProvide } from '../public/context';

export default class contextPage extends Component{
    constructor(props) {
        super(props);

        this.state = {
            theme: {
                color: 'red'
            }
        }
    }
    render() {
        const { theme } = this.state;
        return (
            <div>
                <h3>contextPage</h3>
                <ThemeProvide value={theme}>
                    <ContextType />
                    <ContextConsumer />
                </ThemeProvide>
            </div>
        )
    }
}
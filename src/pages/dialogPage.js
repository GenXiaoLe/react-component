import React, { Component } from 'react';

// 引入传送门插件
import { createPortal } from 'react-dom';

export default class Dialog extends Component{
    constructor(props) {
        super(props);
        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);
    }
    componentWillUnmount() {
        window.document.body.removeChild(this.node);
    }
    render() {
        return createPortal(
            <div className="dialogName">
                <h3>
                    dialog
                </h3>
            </div>,
            this.node
        )
    }
}
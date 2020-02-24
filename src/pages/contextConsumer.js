import React from 'react';

import { ThemeConsumer } from '../public/context';

export default function(props) {
    return (
        <div>
            <ThemeConsumer>{
                ctx => <div>{ctx.color}</div>
            }</ThemeConsumer>
        </div>
    )
}
import React from 'react';
// context 只能是一对一 订阅一个
// 1. 创建createContext
// 2. Provide接收value，传递到子组件
// 3. 使用Consumer接收或者ThemeContext声明contextType

// 创建上下文
const ThemeContext = React.createContext();
// 创建provide组件 用来传递上下文 只能用与组件
const ThemeProvide = ThemeContext.Provider;

// 创建Consumer组件 用来传递上下文 可以用于函数式组件
const ThemeConsumer = ThemeContext.Consumer;

export { ThemeContext, ThemeProvide, ThemeConsumer };
import React, { Component } from 'react'
import { Button } from 'antd';

import HocPage from './pages/HOCpage';
import FormPage from './pages/FormPage';
import ContextPage from './pages/contextPage';
import RudexPage from './pages/rudexPage';
import ReduxReactPage from './pages/rudexReactPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
        <HocPage />
        <FormPage />
        <ContextPage />
        <RudexPage />
        <ReduxReactPage />
      </div>
    )
  }
}
export default App
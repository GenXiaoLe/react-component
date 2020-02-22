import React, { Component } from 'react'
import { Button } from 'antd';

import HocPage from './pages/HOCpage';
import FormPage from './pages/FormPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
        <HocPage />
        <FormPage />
      </div>
    )
  }
}
export default App
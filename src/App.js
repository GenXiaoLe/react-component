import React, { Component } from 'react'

import HocPage from './pages/HOCpage';
import FormPage from './pages/FormPage';
import ContextPage from './pages/contextPage';
import RudexPage from './pages/rudexPage';
import ReduxReactPage from './pages/rudexReactPage';
import RouterPage from './pages/routerPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HocPage />
        <FormPage />
        <ContextPage />
        <RudexPage />
        <ReduxReactPage />
        <RouterPage />
      </div>
    )
  }
}
export default App
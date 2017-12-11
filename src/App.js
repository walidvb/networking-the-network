import React, { Component } from 'react';

import './App.css';

import Processing from './Processing';
import WebSocketWrapper from './WebSocketWrapper';
const randomColor = require('randomcolor'); // import the script 


class App extends Component {
  constructor(){
    super();
  }
  renderColor() {
    const { time } = this.props.messages;
    let r = 255, g = 255, b = 255;
    r = time / 2 % 255;
    let color = randomColor();
    const backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`;
    return (
      <div className="App" style={{ backgroundColor }}>
        <div>{time};</div>
      </div>
    );
  }
  renderP5() {
    return <Processing />
  }
  render(){
    return <div className="App">
      <WebSocketWrapper>
        {this.renderP5()}
      </WebSocketWrapper>
    </div>
  }
}

export default App;

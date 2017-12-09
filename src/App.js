import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const url = "192.168.2.147";

var bluetoothSocket = new WebSocket(`ws://${url}:8025/ws`);

class App extends Component {
  constructor(){
    super();
    this.state = {
      ws: {}
    };
    this.initWebSocket = this.initWebSocket.bind(this);
  }
  
  componentDidMount() {
    this.initWebSocket();
  }
  componentWillUnmount(){
    bluetoothSocket.close();
  }
  initWebSocket(){
    bluetoothSocket.onmessage = ({ data }) => this.setState({
      ws: JSON.parse(data),
    });
  }
  render() {
    const { time } = this.state.ws;
    let r = 255, g = 255, b = 255;
    r = time/2 % 255;
    const backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`;
    return (
      <div className="App" style={{backgroundColor}}>
        <div>{ time };</div>
      </div>
    );
  }
}

export default App;

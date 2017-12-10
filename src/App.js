import React, { Component } from 'react';

import './App.css';

import Processing from './Processing';
const randomColor = require('randomcolor'); // import the script 

const remoteHost = "192.168.2.151";
const url = window.location.hostname === 'localhost' ? remoteHost : window.location.hostname;

let bluetoothSocket;
bluetoothSocket = new WebSocket(`ws://${url}:8025/ws`);

let msgCount = 0;
const id = parseInt(Math.random()*10000000);
class App extends Component {
  constructor(){
    super();
    this.state = {
      initiated: false,
      closed: false,
      ws: {},
      id: undefined,
      running: true,
    };
    this.initWebSocket();
    this.initWebSocket = this.initWebSocket.bind(this);
  }
  send(msg){
    if (this.state.socketState === bluetoothSocket.OPEN){
      bluetoothSocket.send(JSON.stringify(msg));
    }
    else{
      bluetoothSocket.onopen = () => bluetoothSocket.send(JSON.stringify(msg));
    }
    return true;
  }
  closeSocket(){
    this.setState({
      closed: true,
    });
    this.send({ id: this.state.id, action: "close" });
    // do not close as it crashes the server
    // bluetoothSocket.close();
  }
  handleVisibilityStatus(){
    // Adapted slightly from Sam Dutton
    // Set name of hidden property and visibility change event
    // since some browsers only offer vendor-prefixed support
    var hidden, state, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
      state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
      state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
      state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
      state = "webkitVisibilityState";
    }

    // Add a listener that constantly changes the title
    document.addEventListener(visibilityChange, () => {
      var hidden = document[state] == 'hidden';
      if(hidden){
        this.closeSocket();
      } else {
        this.setState({
          closed: false,
          id: undefined,
        }, this.initWebSocket)        
      }
      this.setState({
        running: !hidden,
      });
    }, false);
  }
  componentDidMount() {
    this.handleVisibilityStatus();
  }
  componentWillUnmount(){
    this.closeSocket();
  }
  handleWebsocketMessage({ data }){
    const dataJson = JSON.parse(data);
    msgCount++;
    this.setState({
      ws: dataJson,
      clientsCount: dataJson.clientsCount,
    });
  }
  initWebSocket(){
    // this.setState({ socketState: bluetoothSocket.readyState })
    bluetoothSocket.onopen = () => this.setState({ socketState: bluetoothSocket.readyState })
    bluetoothSocket.onmessage = this.handleWebsocketMessage.bind(this);
    setInterval(() => {
      if(this.state.running){
        this.send({action: "ping", id})
      }
    }, 100);
  }
  renderColor() {
    const { time } = this.state.ws;
    let r = 255, g = 255, b = 255;
    r = time/2 % 255;
    let color = randomColor();
    const backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`;
    return (
      <div className="App" style={{backgroundColor}}>
        <div>{ time };</div>
      </div>
    );
  }
  renderP5(){
    return <Processing messages={this.state.ws} />
  }
  render(){
    if (this.state.socketState !== bluetoothSocket.OPEN){
      return (
        <h1>
          {this.state.socketState == bluetoothSocket.CLOSED ? "Closed" : "Connecting with love"}: {this.state.socketState} { bluetoothSocket.readyState}
        </h1>
      )
    }
    return <div>
      <div>{id}/{this.state.clientsCount};</div>
      {this.renderP5()}
    </div>
  }
}

export default App;

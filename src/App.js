import React, { Component } from 'react';

import './App.css';

import Processing from './Processing';
const randomColor = require('randomcolor'); // import the script 

const remoteHost = "192.168.2.151";
const url = window.location.hostname === 'localhost' ? remoteHost : window.location.hostname;

let bluetoothSocket;

class App extends Component {
  constructor(){
    super();
    this.state = {
      initiated: false,
      ws: {},
      id: undefined,
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
  }
  closeSocket(){
    this.send({ id: this.state.id, closed: true });
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
      console.log(hidden, document[state]);
      if(hidden){
        this.closeSocket();
      } else {
        this.initWebSocket();
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
  initWebSocket(){
    bluetoothSocket = new WebSocket(`ws://${url}:8025/ws`);
    bluetoothSocket.onopen = () => this.setState({socketState: bluetoothSocket.readyState});
    bluetoothSocket.onclose = () => this.setState({ socketState: bluetoothSocket.readyState });
    bluetoothSocket.onmessage = ({ data }) => {
      const dataJson = JSON.parse(data);
      if(this.state.id === undefined){
        const id = dataJson.clientsCount + 1;
        this.send({id});
        this.setState({
          id, 
        })
      }
      this.setState({
        ws: dataJson,
        clientsCount: dataJson.clientsCount,
      });
    }
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
          {this.state.socketState == bluetoothSocket.CLOSED ? "Closed" : "Connecting with love"}
        </h1>
      )
    }
    return <div>
      <div>{this.state.id}/{this.state.clientsCount};</div>
      {this.renderP5()}
    </div>
  }
}

export default App;

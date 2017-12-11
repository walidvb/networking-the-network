import React, { Component } from 'react';

const remoteHost = "192.168.2.147";
const url = window.location.hostname === 'localhost' ? remoteHost : window.location.hostname;

let bluetoothSocket;
bluetoothSocket = new WebSocket(`ws://${url}:8025/ws`);

let msgCount = 0;
const id = parseInt(Math.random() * 10000000);
class WebSocketWrapper extends Component {
    constructor() {
        super();
        this.state = {
            initiated: false,
            closed: false,
            ws: {},
            id: undefined,
            running: true,
            socketState: bluetoothSocket.readyState,
        };
        this.initWebSocket();
        this.initWebSocket = this.initWebSocket.bind(this);
    }
    send(msg) {
        if (this.state.socketState === bluetoothSocket.OPEN) {
            bluetoothSocket.send(JSON.stringify(msg));
        }
        else {
            bluetoothSocket.onopen = () => bluetoothSocket.send(JSON.stringify(msg));
        }
        return true;
    }
    closeSocket() {
        this.setState({
            closed: true,
        });
        this.send({ id: this.state.id, action: "close" });
        // do not close as it crashes the server
        // bluetoothSocket.close();
    }
    handleVisibilityStatus() {
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
            if (hidden) {
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
    componentWillUnmount() {
        this.closeSocket();
    }
    handleWebsocketMessage({ data }) {
        const dataJson = JSON.parse(data);
        // console.log(dataJson);
        msgCount++;
        this.setState({
            ws: dataJson,
            clientsCount: dataJson.clientsCount,
            socketState: bluetoothSocket.readyState,
        });
    }
    initWebSocket() {
        // this.setState({ socketState: bluetoothSocket.readyState })
        bluetoothSocket.onopen = () => this.setState({ socketState: bluetoothSocket.readyState })
        bluetoothSocket.onmessage = this.handleWebsocketMessage.bind(this);
        setInterval(() => {
            if (this.state.running) {
                this.send({ action: "ping", id })
            }
        }, 100);
    }
    render() {
        if (this.state.socketState != bluetoothSocket.OPEN) {
            (
                <div className="connection-status">
                    {this.state.socketState == bluetoothSocket.CLOSED ? "Closed" : "Connecting with love"}
                </div>
            )
        }
        return <div>
            {React.cloneElement(this.props.children, { messages: this.state.ws })}

        </div>
    }
}

export default WebSocketWrapper;

import React, { Component } from 'react'
import P5Wrapper from 'react-p5-wrapper';

import simplePolygon from './sketches/polygonSimple';
import polygonMorph from './sketches/polygonMorph';
const randomColor = require('randomcolor'); // import the script 

const sketches = [simplePolygon, polygonMorph];
export default class Processing extends Component {
    constructor(){
        super();
        this.state = {
            displayInfo: true,
            color: randomColor({ format: 'hex' })
        }
        this.clickInfo = this.clickInfo.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({
            ...props.messages,
        })
    }
    clickInfo(evt){
        evt.stopPropagation();
        this.setState({
            displayInfo: !this.state.displayInfo,
        })
    }
    renderInfo(){
        if(this.state.displayInfo){
            return (
                <div className="info-container" onClick={this.clickInfo.bind(this)}>
                    <h1> CODES IN MOTION </h1>
                    <p>
                        The smart wearable developed by Aline Martinez allows to transform body movement into electrical signals.
                        <br />
                        The current piece is a collaboration with walidvb to demonstrate one of its many usage. 
                        <br />
                         <i>Look for the person</i> controlling the position of the displayed polygon while each viewer participates directly informing its shape.
                    </p>
                </div>
            )
            return(
                <div className="info-container" >
                    <h1> CODES IN MOTION </h1>
                    1. Join MitDir wifi 
                    <br/>
                    2. Visit {`${window.location.host}`} 
                    <br />
                    3. Participate in the piece
                    <br />
                    4. Find the wearable and interact with the shape!
                </div>
            )
        }
    }
    changeColor(){
        this.setState({
            color: randomColor({format: 'hex'})
        })
    }
    render() {
        return (
            <div onClick={this.changeColor}>
                <div className="info-trigger" onClick={this.clickInfo}>i</div>
                { this.renderInfo() }
                <P5Wrapper 
                    sensor0={this.state.sensor0} 
                    sensor1={this.state.sensor1} 
                    sensor2={this.state.sensor2} 
                    sensor3={this.state.sensor3} 
                    color={this.state.color}
                    time={this.state.time} 
                    sides={this.state.clientsCount}
                    sketch={sketches[0]} 
                />
                    
            </div>
        )
    }
}

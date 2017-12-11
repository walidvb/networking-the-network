import React, { Component } from 'react'
import P5Wrapper from 'react-p5-wrapper';

import simplePolygon from './sketches/polygonSimple';
import polygonMorph from './sketches/polygonMorph';


const sketches = [simplePolygon, polygonMorph];
export default class Processing extends Component {
    constructor(){
        super();
        this.state = {
            displayInfo: false,
        }
        this.clickInfo = this.clickInfo.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({
            ...props.messages,
        })
    }
    clickInfo(){
        this.setState({
            displayInfo: !this.state.displayInfo,
        })
    }
    renderInfo(){
        if(this.state.displayInfo){
            return (
                <div className="info-container">
                    <h1> CODES IN MOTION </h1>
                    <p>The smart wearable developed by Aline Martinez allows to transform body movement into electrical signals.
                        <br />
                        The current piece is a collaboration with walidvb to demonstrate one of its many usage. 
                        <br />
                        Somebody around you is controlling the position of the displayed polygon, while each viewer participates directly in forming its shape.
                    </p>
                </div>
            )
            return(
                <div className="info-container">
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
    render() {
        return (
            <div>
                <div className="info-trigger" onClick={this.clickInfo}>i</div>
                { this.renderInfo() }
                #: {this.state.clientsCount}
                <P5Wrapper rotation={this.state.sensor3} 
                    sketch={sketches[0]} 
                    time={this.state.time} 
                    sides={this.state.clientsCount}>
                </P5Wrapper>
            </div>
        )
    }
}

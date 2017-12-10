import React, { Component } from 'react'
import P5Wrapper from 'react-p5-wrapper';

import simplePolygon from './sketches/polygonSimple';
import polygonMorph from './sketches/polygonMorph';


const sketches = [simplePolygon, polygonMorph];
export default class Processing extends Component {
    constructor(){
        super();
        this.state = {

        }
    }
    componentWillReceiveProps(props){
        this.setState({
            ...props.messages,
        })
    }
    render() {
        return (
            <div>
                <div>{this.props.time};</div>
                <P5Wrapper sketch={sketches[0]} time={this.state.time} sides={this.state.clientsCount}>
                    
                </P5Wrapper>
            </div>
        )
    }
}

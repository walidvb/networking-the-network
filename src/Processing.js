import React, { Component } from 'react'
import P5Wrapper from 'react-p5-wrapper';

const TWO_PI = Math.PI * 2

export default class Processing extends Component {
    constructor(){
        super();
        this.state = {

        }
    }
    setup(p){
        
    }
    sketch(p){
        let rotation = 0;
        let sides = 0;
        p.setup = function () {
            p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        };

        p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
            if (props.sides) {
                sides = props.sides;
            }
        };

        p.draw = function () {
            p.background(120);
            p.noStroke();
            p.push();
            p.rotateY(rotation);
            //console.log(rotation);
            // p.box(window.innerWidth, 10);
            polygon(0, 0, 80, sides); 
            p.pop();
        };
        
        function polygon(x, y, radius, npoints) {
            var angle = TWO_PI / npoints;
            p.stroke('red');
            p.noFill()
            p.beginShape();
            for (var a = 0; a < TWO_PI; a += angle) {
                var sx = x + Math.cos(a) * radius;
                var sy = y + Math.sin(a) * radius;
                p.vertex(sx, sy);
            }
            p.endShape(p.CLOSE);
        }
    }
    componentWillReceiveProps(props){
        this.setState({
            time: props.messages.time,
            clientsCount: props.messages.clientsCount+1,

        })
    }
    render() {
        return (
            <div>
                <div>{this.props.time};</div>
                <P5Wrapper sketch={this.sketch} time={this.state.time} sides={this.state.clientsCount}>
                    
                </P5Wrapper>
            </div>
        )
    }
}

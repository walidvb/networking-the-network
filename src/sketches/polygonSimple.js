const TWO_PI = Math.PI * 2;
export default function(p){
    let rotation = 0;
    let sides = 0;
    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.sides) {
            sides = props.sides;
            rotation = props.time / 400;
        }
    };

    p.draw = function () {
        p.background(120);
        p.noStroke();
        p.push();
        p.rotateX(rotation);
        if(sides > 1){
            polygon(0, 0, 80, sides);
        }
        else{
            p.stroke('red');
            p.box(1);
        }
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
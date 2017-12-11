export default function(p){
    const TWO_PI = p.TWO_PI;
    let rotationX = 0;
    let rotationY = 0;
    let translation = 0;
    let sides = 0;
    let time = 0;
    let sensor0, sensor1, sensor2, sensor3;
    let start = new Date().getTime();
    p.setup = function () {
        console.log(window.innerWidth);
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.sides) {
            sides = props.sides;
        }
        if (props.time) {
            time = props.time;
        }
        if(props.sensor2){
            rotationY = p.lerp(rotationX, props.sensor2 / 180 * Math.PI, .1);
        }
        if (props.sensor3){
            rotationX = p.lerp(rotationX, props.sensor3 / 180 * Math.PI, .1) ;
            translation = p.lerp(translation, p.map(props.sensor3, -20, 50, 0, window.innerWidth), .05);
        }
        sensor0 = props.sensor0;
        sensor1 = props.sensor1;
        sensor2 = props.sensor2;
        sensor3 = props.sensor3;
    };

    p.draw = function () {
        time = new Date().getTime() - start;
        const wobble = Math.sin(time/100) / 50 ;
        p.background(120);
        //p.text("p.frameRate", p.frameRate(), 5, 5);
        p.noStroke();
        p.push();
        if (sides == 1){
            p.stroke('red');
            console.log(translation, (translation + 10) * p.height * .4);
            const scale = p.map(sensor3, -40, 40, 10, window.innerWidth*.4);
            p.translate(wobble * 20, wobble * 30);
            p.sphere(Math.min(scale + wobble * scale, 10+wobble*10));
        }
        else if( sides == 2){
            const normalized = (rotationX * p.height);
            p.translate(0, Math.max(0, Math.min(normalized, .45 * p.height)));
            p.translate(0, wobble * 200)
            polygon(0, 0, Math.min(p.width * .4, p.height * .4), sides);
        }
        else if(sides > 2){
            p.rotateX(rotationX);
            p.rotateZ(wobble * p.PI);
            p.rotateY(rotationY);
            polygon(0, 0, Math.min(p.width * .4, p.height * .4), sides);
        }
        p.pop();
    };

    // p.windowResized  = () => {
    //     p.resizeCanvas(window.innerWidth, window.innerHeight);
    // };
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
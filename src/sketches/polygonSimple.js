export default function(p){
    const TWO_PI = p.TWO_PI;
    let rotation = 0;
    let translation = 0;
    let sides = 0;
    let time = 0;
    let start = new Date().getTime();
    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.sides) {
            sides = props.sides;
        }
        if (props.time) {
            time = props.time;
        }
        if (props.rotation){
            rotation = p.lerp(rotation, props.rotation / 180 * Math.PI, .1) ;
            translation = p.lerp(translation, p.map(rotation, -20, 50), .05);
        }
    };

    p.draw = function () {
        time = new Date().getTime() - start;
        const wobble = Math.sin(time/100) / 50 ;
        p.background(120);
        p.smooth(2);
        //p.text("p.frameRate", p.frameRate(), 5, 5);
        p.noStroke();
        p.push();
        if(sides > 1){
            if(sides > 2){
                p.rotateX(rotation);
                p.rotateZ(wobble * p.PI);
            }
            else{
                const normalized = (rotation * p.height);
                p.translate(0, Math.max(0, Math.min(normalized, .45*p.height)));
                p.translate(0, wobble*200)
            }
            polygon(0, 0, Math.min(p.width*.4, p.height*.4), sides);
        }
        else if (sides == 1){
            p.stroke('red');
            console.log(translation, (translation + 10) * p.height * .4);
            const size = translation * p.height * .4;
            p.translate(wobble * 20, wobble * 30);
            p.sphere(Math.min(size + wobble*size, 10+wobble*10));
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
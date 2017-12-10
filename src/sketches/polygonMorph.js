export default function (p) {
  // Two ArrayLists to store the vertices for two shapes
  // This example assumes that each shape will have the same
  // number of vertices, i.e. the createCanvas of each ArrayList will be the same
  let circle = [];
  let square = [];

  // An ArrayList for a third set of vertices, the ones we will be drawing
  // in the window
  let morph = [];

  // This var variable will control if we are morphing to a circle or square
  var state = false;

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight, p.webGL);

    // Create a circle using vectors povaring from center
    for (var angle = 0; angle < 360; angle += 9) {
      // Note we are not starting from 0 in order to match the
      // path of a circle.  
      var v = p.createVector(0, 100)
      v.rotate(p.radians(angle-135));
      circle.push(v);
      // Let's fill out morph ArrayList with blank vars while we are at it
      morph.push(p.createVector());
    }

    // A square is a bunch of vertices avar straight lines
    // Top of square
    for (var x = -50; x < 50; x += 10) {
      square.push(p.createVector(x, -50));
    }
    // Right side
    for (var y = -50; y < 50; y += 10) {
      square.push(p.createVector(50, y));
    }
    // Bottom
    for (var x = 50; x > -50; x -= 10) {
      square.push(p.createVector(x, 50));
    }
    // Left side
    for (var y = 50; y > -50; y -= 10) {
      square.push(p.createVector(-50, y));
    }
  }

  p.draw = () => {
    p.background(51);

    // We will keep how far the vertices are from their target
    var totalDistance = 0;
    
    // Look at each vertex
    for (var i = 0; i < circle.length; i++) {
      let v1 = {};
      // Are we lerping to the circle or square?
      if (state) {
        v1 = circle[i];
      }
      else {
        v1 = square[i];
      }
      // Get the vertex we will draw
      var v2 = morph[i];
      // Lerp to the target
      const x = p.lerp(v1.x,v2.x, 0.9)
      const y = p.lerp(v1.y, v2.y, 0.9)
      v2.set(x,y);
      // Check how far we are from target
      totalDistance += v1.dist(v2);
    }
    
    // If all the vertices are close, switch shape
    if (totalDistance < 0.1) {
      state = !state;
    }
    
    // Draw relative to center
    p.translate(p.width/2, p.height/2);
    p.strokeWeight(4);
    // Draw a polygon that makes up all the vertices
    p.beginShape();
    p.noFill();
    p.stroke(255);
    morph.map((v) => p.vertex(v.x, v.y))
    p.endShape(p.CLOSE);
  }
}
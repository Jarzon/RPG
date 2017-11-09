// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

var WIDTH = 0;
var HEIGHT = 0;

var setSize = function () {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight-5;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
};

setSize();

window.addEventListener('resize', setSize);

var walker = new Walker(window.innerWidth/2, window.innerHeight/2, ctx);

var mouse = new Vector(0, 0);

document.onmousemove = function (event) {
    mouse.set(event.pageX, event.pageY);
};

var target = new Vector(0, 0);

// Draw everything
var render = function () {
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    target = mouse;

    walker.display();
};

// The main game loop
var main = function () {
    walker.update();
    walker.seek(target);

    render();
};

// Let's play this game!
setInterval(main, 1);
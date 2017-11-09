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

// Events

document.onmousemove = function (event) {
    mouse.set(event.pageX, event.pageY);
};

var controls = new Controls();

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    controls.keypress(key);
};

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    controls.keyreleash(key);
};

var UPARROW = 38,
    DOWNARROW = 40,
    LEFTARROW = 37,
    RIGHTARROW = 39;

// Draw everything
var render = function () {
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    walker.display();

    if (controls.keys[UPARROW]) {
        walker.position.add(new Vector(0, -1));
    }
    if (controls.keys[DOWNARROW]) {
        walker.position.add(new Vector(0, 1));
    }
    if (controls.keys[LEFTARROW]) {
        walker.position.add(new Vector(-1, 0));
    }
    if (controls.keys[RIGHTARROW]) {
        walker.position.add(new Vector(1, 0));
    }
};

// The main game loop
var main = function () {
    walker.update();

    render();
};

// Let's play this game!
setInterval(main, 1);
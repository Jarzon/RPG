// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let WIDTH = 0;
let HEIGHT = 0;

let controls = new Controls();

let engine = new Engine(ctx, controls);

let setSize = function () {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight-5;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    engine.resize(WIDTH, HEIGHT);
};

setSize();

window.addEventListener('resize', setSize);

let player = new Walker(window.innerWidth/2, window.innerHeight/2, ctx, engine);

let walker2 = new Walker(100, 100, ctx, engine);

engine.addEntity(player);
engine.addEntity(walker2);

let mouse = new Vector(0, 0);

// Events

document.onmousemove = function (event) {
    mouse.set(event.pageX, event.pageY);
};

window.onkeydown = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;

    controls.keypress(key);
};

window.onkeyup = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;

    controls.keyreleash(key);
};

const UPARROW = 87,
    DOWNARROW = 83,
    LEFTARROW = 65,
    RIGHTARROW = 68;

let main = function () {

    engine.render();
};

setInterval(main, 1);
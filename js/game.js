// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let WIDTH = 0;
let HEIGHT = 0;

let engine = new Engine(ctx);

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

let mouse = new Vector(0, 0);

// Events

document.onmousemove = function (event) {
    mouse.set(event.pageX, event.pageY);
};

let controls = new Controls();

window.onkeydown = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;

    controls.keypress(key);
};

window.onkeyup = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;

    controls.keyreleash(key);
};

let UPARROW = 38,
    DOWNARROW = 40,
    LEFTARROW = 37,
    RIGHTARROW = 39;

// Draw everything
let render = function () {
    engine.background();

    player.display();
    walker2.display();

    if (controls.keys[UPARROW]) {
        player.move(0, -1);
    }
    if (controls.keys[DOWNARROW]) {
        player.move(0, 1);
    }
    if (controls.keys[LEFTARROW]) {
        player.move(-1, 0);
    }
    if (controls.keys[RIGHTARROW]) {
        player.move(1, 0);
    }
};

// The main game loop
let main = function () {

    render();
};

// Let's play this game!
setInterval(main, 1);
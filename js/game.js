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
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    engine.resize(WIDTH, HEIGHT);
};

setSize();

window.addEventListener('resize', setSize);

let player = new Walker(12800 + window.innerWidth/2, 12800 + window.innerHeight/2, ctx, engine);

let walker2 = new Walker(12800 + 100, 12800 + 100, ctx, engine);

engine.addEntity(player);
engine.addEntity(walker2);

let mouse = new Vector(0, 0);

// Events

document.onmousemove = function (event) {
    mouse.set(event.pageX, event.pageY);
};

window.onkeydown = function(e) {
    controls.keydown(e.keyCode);
};

window.onkeyup = function(e) {
    if(e.keyCode === F9) {
        engine.toggleDebug();
    }

    controls.keyup(e.keyCode);
};

const F9 = 120,
    UPARROW = 38,
    DOWNARROW = 40,
    LEFTARROW = 37,
    RIGHTARROW = 39,
    W_KEY = 87,
    S_KEY = 83,
    A_KEY = 65,
    D_KEY = 68,
    E_KEY = 69,
    SPACE = 32
;

let stopMain;

let main = function () {
    stopMain = window.requestAnimationFrame(main);

    engine.render();
    engine.update();
};

main();
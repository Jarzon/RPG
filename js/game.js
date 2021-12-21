// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let WIDTH = 0;
let HEIGHT = 0;

let controls = new Controls();

let menu = new HomeMenu(ctx, controls);
let engine = new Engine(ctx, controls, menu);

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
    controls.keydown(e.key);
};

window.onkeyup = function(e) {
    if(e.key === F9) {
        engine.toggleDebug();
    }

    controls.keyup(e.key);
};

const F9 = 120,
    UPARROWUPARROW = 'ArrowUp',
    DOWNARROW = 'ArrowDown',
    LEFTARROW = 'ArrowLeft',
    RIGHTARROW = 'ArrowRight',
    W_KEY = 'w',
    S_KEY = 's',
    A_KEY = 'a',
    D_KEY = 'd',
    E_KEY = 'e',
    SPACE = ' '
;

let stopMain;

let main = function () {
    stopMain = window.requestAnimationFrame(main);

    engine.render();
    engine.update();
};

main();
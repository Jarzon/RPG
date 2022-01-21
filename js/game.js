// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let WIDTH = 0;
let HEIGHT = 0;

let controls = new Controls();

let view = new Panel(0, 0, 0, 0);

let map = new Map(ctx, view);
let menu = new HomeMenu(ctx, controls);
let engine = new Engine(ctx, view, map, controls, menu);

let setSize = function () {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    engine.resize(WIDTH, HEIGHT);
};

setSize();

window.addEventListener('resize', setSize);

engine.initialize();

let player = new Entity(window.innerWidth/2, window.innerHeight/2, ctx, engine);

let walker2 = new Entity(100, 100, ctx, engine);

engine.addEntity(player);
engine.addEntity(walker2);

// Events

document.onmousemove = function (event) {
    controls.mouse.set(event.pageX, event.pageY);
};

let mouseButtons = ['left', 'right', '', 'middle'];

window.onmousedown = function(e) {
    controls.keydown('mouse_' + mouseButtons[e.buttons-1]);
};

window.onmouseup = function(e) {
    controls.keyup('mouse_' + mouseButtons[e.button]);
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

const F9 = 'F9',
    ESC = 'Escape',
    MOUSE_LEFT = 'mouse_left',
    MOUSE_RIGHT = 'mouse_right',
    UPARROWUPARROW = 'ArrowUp',
    DOWNARROW = 'ArrowDown',
    LEFTARROW = 'ArrowLeft',
    RIGHTARROW = 'ArrowRight',
    W_KEY = 'w',
    S_KEY = 's',
    A_KEY = 'a',
    D_KEY = 'd',
    E_KEY = 'e',
    SPACE = ' ';

let stopMain;

let main = function (now) {
    stopMain = window.requestAnimationFrame(main);

    engine.tick(now);
};

main();
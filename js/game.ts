// Create the canvas
let viewCanvas = document.createElement("canvas");
viewCanvas.id = 'view';
let viewCtx = viewCanvas.getContext("2d");

let deckCanvas = document.createElement("canvas");
deckCanvas.id = 'deck';
let deckCtx = deckCanvas.getContext("2d");
document.body.appendChild(viewCanvas);
document.body.appendChild(deckCanvas);

let WIDTH = 0;
let HEIGHT = 0;

let view = new Panel(0, 0, 0, 0);

let controls = new Controls(view);

let map = new Map(deckCtx, viewCtx, view);
let menu = new HomeMenu(viewCtx, controls);
let engine = new Engine(viewCtx, view, map, controls, menu);

let setSize = function () {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    viewCanvas.width = WIDTH;
    viewCanvas.height = HEIGHT;

    deckCanvas.width = WIDTH;
    deckCanvas.height = map.size;

    engine.resize(WIDTH, HEIGHT);
};

setSize();

window.addEventListener('resize', setSize);

engine.initialize();

let player = new Entity(window.innerWidth/2, window.innerHeight/2, 75, 80, viewCtx);
let walker2 = new Entity(100, 100, 75, 80, viewCtx);

engine.addEntity(player);
engine.addEntity(walker2);

// Events

window.addEventListener("contextmenu", e => e.preventDefault());

document.onmousemove = function (event) {
    controls.setMousePosition(event.pageX, event.pageY);
};

let mouseButtons = ['left', 'middle', 'right', ''];

window.onmousedown = function(e) {
    controls.keydown('mouse_' + mouseButtons[e.button]);
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

let main = function (now: number = 0) {
    stopMain = window.requestAnimationFrame(main);

    engine.tick(now);
};

main();
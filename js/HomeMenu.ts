class TextElement {
    text: string;
    callback: any;
    selected: boolean;
    ctx: any;
    position: Vector;
    dimension: Vector;

    constructor(text: string, x: number, y: number, callback: any, ctx: any) {
        this.text = text;
        this.callback = callback;
        this.position = new Vector(x, y);
        this.selected = false;

        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let dim = ctx.measureText(text);
        this.ctx = ctx;
        this.dimension = new Vector(dim.width, 35);
    }

    displayTextbox() {
        this.ctx.fillStyle = this.selected? "#9200ff": "#ffffff";
        this.ctx.font = "30px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.text, this.position.x, this.position.y);
    }

    mouseCollision(controls: any) {
        this.selected = controls.mouse.x > this.position.x - this.dimension.x / 2
            && controls.mouse.y > this.position.y - this.dimension.y / 2
            && controls.mouse.x < (this.position.x + this.dimension.x / 2)
            && controls.mouse.y < (this.position.y + this.dimension.y / 2);

        if(this.selected && controls.key(MOUSE_LEFT)) {
            this.callback();
        }
    }
}

class HomeMenu {
    ctx: any;
    controls: any;
    menuHeight: number;
    menu: Array<any>;
    engine: Engine;

    constructor(ctx: any, controls: any) {
        this.ctx = ctx;
        this.controls = controls;
        this.menuHeight = 0;
        this.menu = [];
    }

    addMenuElement(text: any, callback: any) {
        let el = new TextElement(
            text,
            this.engine.view.width/2,
            this.menuHeight,
            callback,
            this.ctx
        );

        this.menu.push(el);

        this.menuHeight += el.dimension.y;
    }

    reinitialize() {
        this.menu = [];
        this.initialize();
    }

    initialize() {
        let self = this;
        this.menuHeight = this.engine.view.height/3;
        this.addMenuElement('Play', function () {
            self.engine.state = 1;
        });
        this.addMenuElement('Options', function () {

        });
        this.addMenuElement('Quit', function () {
            if(confirm('Etes vous sur de vouloir quitter ?')) {
                window.close();
            }
        });
    }

    setEngine(engine: Engine) {
        this.engine = engine;
    }

    draw() {
        this.drawBackground();

        for(let text of this.menu) {
            text.displayTextbox();
            text.mouseCollision(this.controls);
        }
    }

    drawBackground()
    {
        this.ctx.fillStyle = 'hsl(212, 50%, 30%)';

        this.ctx.fillRect(
            0,
            0,
            this.engine.view.width,
            this.engine.view.height
        );

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
class TextElement {
    constructor(text, x, y, callback, ctx) {
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

    mouseCollision(controls) {
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
    constructor(ctx, controls) {
        this.ctx = ctx;
        this.controls = controls;
        this.menuHeight = 0;
        this.menu = [];
    }

    addMenuElement(text, callback) {
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

    setEngine(engine) {
        this.engine = engine;
    }

    draw() {
        for(let text of this.menu) {
            text.displayTextbox();
            text.mouseCollision(this.controls);
        }
    }

    drawBackground()
    {
        ctx.fillStyle = 'hsl(212, 50%, 30%)';

        this.ctx.fillRect(
            0,
            0,
            this.engine.view.width,
            this.engine.view.height
        );

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
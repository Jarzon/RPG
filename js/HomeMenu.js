class TextElement {
    constructor(text, x, y, ctx) {
        this.text = text;
        this.position = new Vector(x, y);

        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let dim = ctx.measureText(text);
        this.dimension = new Vector(dim.width, 35);
    }

    displayTextbox(ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.position.x, this.position.y);
    }
}

class HomeMenu {
    constructor(ctx) {
        this.ctx = ctx;
        this.menuHeight = 0;
        this.menu = [];
    }

    addMenuElement(text) {
        let el = new TextElement(
            text,
            this.engine.view.width/2,
            this.menuHeight,
            this.ctx
        );

        this.menu.push(el);

        this.menuHeight += el.dimension.y;
    }

    initialize() {
        this.menuHeight = this.engine.view.height/3;
        this.addMenuElement('Play');
        this.addMenuElement('Quit');
    }

    setEngine(engine) {
        this.engine = engine;
    }

    draw() {
        for(let text of this.menu) {
            text.displayTextbox(this.ctx);
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

    tick() {

    }
}
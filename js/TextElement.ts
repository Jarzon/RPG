class TextElement {
    text: string;
    callback: any;
    selected: boolean;
    ctx: any;
    position: Panel;

    constructor(text: string, x: number, y: number, callback: any, ctx: any) {
        this.text = text;
        this.callback = callback;
        this.selected = false;

        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let dim = ctx.measureText(text);
        this.ctx = ctx;
        this.position = new Panel(x, y, dim.width, dim.fontBoundingBoxAscent + dim.fontBoundingBoxDescent);
    }

    displayTextbox() {
        this.ctx.fillStyle = this.selected? "#9200ff": "#ffffff";
        this.ctx.font = "30px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.text, this.position.position.x, this.position.position.y);
    }

    mouseCollision(controls: any) {
        this.selected = this.position.vectorColision(controls.mouse);

        if(this.selected && controls.key(MOUSE_LEFT)) {
            this.callback();
        }
    }
}

class Engine {
    constructor(ctx) {
        this.width = 0;
        this.height = 0;

        this.ctx = ctx;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    background() {
        this.ctx.fillStyle = '#222222';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    textbox(text, margin = 20, borderSize = 5) {
        let boxHeight = 100;

        // TODO: Align the text vertically

        this.ctx.fillStyle = "#000000";

        this.ctx.fillRect(margin, this.height - (boxHeight+margin), this.width-(margin*2+borderSize), boxHeight);
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(margin+borderSize, this.height - (boxHeight+margin-borderSize), this.width-(margin*3-borderSize), boxHeight-borderSize*2);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, this.width/2, this.height - 75);
    }
}
class HomeMenu {
    constructor(ctx, engine) {
        this.ctx = ctx;
        this.engine = engine;
    }

    displayTextbox(text, margin = 20, borderSize = 5) {
        let boxHeight = 100;

        // TODO: Align the text vertically

        this.ctx.fillStyle = "#000000";

        this.ctx.fillRect(margin, this.engine.view.height - (boxHeight+margin), this.engine.view.width-(margin*2+borderSize), boxHeight);
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(margin+borderSize, this.engine.view.height - (boxHeight+margin-borderSize), this.engine.view.width-(margin*3-borderSize), boxHeight-borderSize*2);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, this.engine.view.width/2, this.engine.view.height - 75);
    }

    draw() {
        this.displayTextbox('Main menu');
    }

    drawBackground() {
        let width = Math.min(512, (this.engine.view.position.x + this.engine.view.width) / this.mapTilesSize);
        let height = Math.min(512, (this.engine.view.position.y + this.engine.view.height) / this.mapTilesSize);

        for(let x = Math.max(0, Math.floor(this.engine.view.position.x / this.mapTilesSize)); x < width; x++) {
            for(let y = Math.max(0, Math.floor(this.engine.view.position.y / this.mapTilesSize)); y < height; y++) {
                let sprite = this.sprites[this.map[x][y]].img;

                this.ctx.setTransform(1, 0, 0, 1, ((x * this.mapTilesSize) - this.engine.view.position.x) - this.mapTilesSize, ((y * this.mapTilesSize) - this.engine.view.position.y) - this.mapTilesSize);
                this.ctx.drawImage(sprite, this.mapTilesSize, this.mapTilesSize);
            }
        }

        this.ctx.setTransform(1,0,0,1,0,0);
    }
}
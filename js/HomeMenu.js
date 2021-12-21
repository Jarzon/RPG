class HomeMenu {
    constructor(ctx) {
        this.ctx = ctx;
    }

    setEngine(engine) {
        this.engine = engine;
    }

    displayTextbox(text, heightPos) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "30px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, this.engine.view.width/2, heightPos);
    }

    draw() {
        let startHeight = this.engine.view.height/3;
        this.displayTextbox('Main menu', startHeight);
        startHeight+=35;
        this.displayTextbox('Play', startHeight);
    }

    drawBackground() {
        const sqareDimention = 10;
        const columns = this.engine.view.width / sqareDimention;
        const rows = this.engine.view.height / sqareDimention;
        const columnColorChange = 255 / columns;
        const rowsColorChange = 255 / rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                ctx.fillStyle =
                    'rgb(' + Math.floor(255 - rowsColorChange * i) + ', ' +
                    Math.floor(255 - columnColorChange * j) + ', 0)';
                this.ctx.fillRect(j * sqareDimention, i * sqareDimention, sqareDimention, sqareDimention);
            }
        }

        this.ctx.setTransform(1,0,0,1,0,0);
    }
}
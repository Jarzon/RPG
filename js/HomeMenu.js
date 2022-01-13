class HomeMenu {
    constructor(ctx) {
        this.ctx = ctx;
        this.gradient = 100;
        this.backgroundSquareDimension = 50;
        this.direction = true;
    }

    initialize() {
        this.columns = this.engine.view.width / this.backgroundSquareDimension;
        this.rows = this.engine.view.height / this.backgroundSquareDimension;
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
        startHeight += 35;
        this.displayTextbox('Play', startHeight);
    }

    drawBackground()
    {
        const columnColorChange = 255 / this.columns;
        const rowsColorChange = 255 / this.rows;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns ; j++) {
                ctx.fillStyle =
                    'hsl(' +
                    Math.floor(this.gradient - columnColorChange * (i + j ) / 2) + ', 100%, 50%)';

                this.ctx.fillRect(
                    j * this.backgroundSquareDimension,
                    i * this.backgroundSquareDimension,
                    this.backgroundSquareDimension,
                    this.backgroundSquareDimension
                );
            }
        }

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    tick() {
        this.gradient += 1;

        if(this.gradient <= 100 || this.gradient >= 255) {
            this.direction = !this.direction;
        }
    }
}
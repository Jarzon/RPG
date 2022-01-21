class Map {
    constructor(ctx, view) {
        this.ctx = ctx;
        this.view = view;
        this.size = 200;
        this.engine = null;

        this.map = [this.size];
        for(let x = 0; x < this.size; x++) {
            this.map[x] = [this.size];
        }

        this.mapTilesSize = 25;

         this.sprites = {
            'earth': {src: 'earth.png', img: {}, color: 'rgb(96,93,0)'},
            'green': {src: 'green.png', img: {}, color: 'rgb(31,148,0)'}
        };

        for(let sprite in this.sprites) {
            if(!this.sprites.hasOwnProperty(sprite)) continue;

            let image = new Image();

            image.src = './img/' + this.sprites[sprite].src;

            this.sprites[sprite].img = image;
        }

        // Temp map

        let spritesList = ['earth', 'green'];
        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++) {
                this.addMapTile(x, y, spritesList[this.getRandomInt(0, 2)]);
            }
        }
    }

    setEngine(engine) {
        this.engine = engine;
    }

    drawBackground() {
        let width = Math.min(this.size, (this.view.position.x + this.view.width) / this.mapTilesSize);
        let height = Math.min(this.size, (this.view.position.y + this.view.height) / this.mapTilesSize);

        for(let x = Math.max(0, Math.floor(this.view.position.x / this.mapTilesSize)); x < width; x++) {
            for(let y = Math.max(0, Math.floor(this.view.position.y / this.mapTilesSize)); y < height; y++) {
                this.ctx.setTransform(
                    1, 0, 0, 1,
                    ((x * this.mapTilesSize) - this.view.position.x) - this.mapTilesSize,
                    ((y * this.mapTilesSize) - this.view.position.y) - this.mapTilesSize
                );
                this.ctx.drawImage(this.sprites[this.map[x][y]].img, this.mapTilesSize, this.mapTilesSize);
            }
        }

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawMiniature() {
        let miniMapPosX = this.view.width - this.size;
        let miniMapPosY = this.view.height - this.size;

        for(let x = 0; x < this.size; x++) {
            let xp = x * this.mapTilesSize;
            for(let y = 0; y < this.size; y++) {
                let color = null;
                let yp = y * this.mapTilesSize;

                for(let entity of this.engine.world) {
                    if(
                        entity.position.x > xp && entity.position.x < xp + this.mapTilesSize
                        && entity.position.y > yp && entity.position.y < yp + this.mapTilesSize
                    ) {
                        color = 'rgb(0,0,255)';
                        continue;
                    }
                }

                if(color === null) {
                    color = this.sprites[this.map[x][y]].color;
                }

                this.ctx.fillStyle = color;

                this.ctx.fillRect(
                    miniMapPosX + x,
                    miniMapPosY + y,
                    1,
                    1
                );
            }
        }

        // camera
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        let miniViewWidth = this.view.width / this.mapTilesSize;
        let miniViewHeight = this.view.height / this.mapTilesSize;

        this.ctx.strokeRect(
            this.minMax(miniMapPosX, miniMapPosX + this.size - miniViewWidth, miniMapPosX + Math.floor(this.view.position.x / this.mapTilesSize)),
            this.minMax(miniMapPosY, miniMapPosY + this.size - miniViewHeight, miniMapPosY + Math.floor(this.view.position.y / this.mapTilesSize)),
            miniViewWidth,
            miniViewHeight
        );
    }

    minMax(min, max, value) {
        return Math.min(max, Math.max(min, value));
    }

    addMapTile(x, y, type) {
        this.map[x][y] = type;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
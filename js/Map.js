class Map {
    constructor(ctx, view) {
        this.ctx = ctx;
        this.view = view;
        this.mapSize = 200;

        this.map = [this.mapSize];
        for(let x = 0; x < this.mapSize; x++) {
            this.map[x] = [this.mapSize];
        }

        this.mapTilesSize = 50;

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
        for(let x = 0; x < this.mapSize; x++) {
            for(let y = 0; y < this.mapSize; y++) {
                this.addMapTile(x, y, spritesList[this.getRandomInt(0, 2)]);
            }
        }
    }

    drawBackground() {
        let width = Math.min(this.mapSize, (this.view.position.x + this.view.width) / this.mapTilesSize);
        let height = Math.min(this.mapSize, (this.view.position.y + this.view.height) / this.mapTilesSize);

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
        for(let x = 0; x < this.mapSize; x++) {
            for(let y = 0; y < this.mapSize; y++) {
                this.ctx.fillStyle = this.sprites[this.map[x][y]].color;

                this.ctx.fillRect(
                    (this.view.width - this.mapSize) + x,
                    (this.view.height - this.mapSize) + y,
                    1,
                    1
                );
            }
        }
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
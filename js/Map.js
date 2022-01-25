class Map {
    constructor(deckCtx, viewCtx, view) {
        let self = this;
        this.deckCtx = deckCtx;
        this.viewCtx = viewCtx;
        this.view = view;
        this.size = 200;
        this.mapTilesSize = 50;
        this.miniMapTileSize = 5;
        this.engine = null;
        this.worker = new Worker("/js/MapWorker.js");

        setTimeout(function () {
            self.worker.addEventListener('message', function (e) {

                if(e.data.type === 'minimap') {
                    self.drawMinimap(e.data);
                }
                if(e.data.type === 'background') {
                    self.drawBackground(e.data);
                }
            });
        }, 100);

        this.map = [this.size];
        for(let x = 0; x < this.size; x++) {
            this.map[x] = [this.size];
        }

        this.sprites = {
            'earth': {src: 'earth.png', img: {}, color: 'rgb(96,66,0)'},
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
        this.worker.postMessage({
            type: 'data',
            mapSize: this.size,
            minimapTileSize: this.miniMapTileSize,
            mapTilesSize: this.mapTilesSize,
            world: JSON.parse(JSON.stringify(this.engine.world)),
            map: JSON.parse(JSON.stringify(this.map)),
            sprites: JSON.parse(JSON.stringify(this.sprites))
        });
    }

    renderBrackground(screenSection) {
        this.worker.postMessage({
            type: 'data',
            view: this.view
        });
        this.worker.postMessage({
            type: 'background',
            screenSection: screenSection
        });
    }

    drawBackground(data) {
        this.viewCtx.clearRect(0, 0, this.view.width, this.view.height - this.size);
        for (let n = 0; n < data.tiles.length; n++) {
            this.viewCtx.setTransform(
                1, 0, 0, 1,
                data.tiles[n].x,
                data.tiles[n].y
            );
            this.viewCtx.drawImage(this.sprites[data.tiles[n].img].img, this.mapTilesSize, this.mapTilesSize);
        }

        this.viewCtx.setTransform(1, 0, 0, 1, 0, 0);
    }

    renderMiniMap() {
        this.worker.postMessage({
            type: 'minimap'
        });
    }

    drawMinimap(data) {
        let boxHeight = 200;

        // Background

        this.deckCtx.fillStyle = "#333333";
        this.deckCtx.fillRect(0, this.view.height - (boxHeight), this.view.width, boxHeight);

        let miniMapPosX = this.view.width - this.size;
        let miniMapPosY = 0;

        // tiles
        for (let n = 0; n < data.tiles.length; n++) {
            this.deckCtx.fillStyle = data.tiles[n].color;

            this.deckCtx.fillRect(
                data.tiles[n].x,
                data.tiles[n].y,
                data.tiles[n].width,
                data.tiles[n].height
            );
        }

        // camera
        this.deckCtx.strokeStyle = "white";
        this.deckCtx.lineWidth = 2;

        let miniViewWidth = this.view.width / this.mapTilesSize;
        let miniViewHeight = this.view.height / this.mapTilesSize;

        this.deckCtx.strokeRect(
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
class Map {
    deckCtx: any
    viewCtx: any
    view: Panel;
    size: any;
    mapTilesSize: any;
    miniMapTileSize: any;
    engine: Engine;
    worker: any;
    map: any;
    sprites: any;

    constructor(deckCtx: any, viewCtx: any, view: Panel) {
        this.deckCtx = deckCtx;
        this.viewCtx = viewCtx;
        this.view = view;
        this.size = 200;
        this.mapTilesSize = 50;
        this.miniMapTileSize = 5;
        this.engine = null;
        this.worker = new Worker("/js/MapWorker.js");

        setTimeout( () => {
            this.worker.addEventListener('message', (e: any) => {

                if(e.data.type === 'minimap') {
                    this.drawMinimap(e.data);
                }
                if(e.data.type === 'background') {
                    this.drawBackground(e.data);
                }
            });
        }, 100);
    }

    generateMap(): void
    {
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

        let spritesList = ['earth', 'green'];
        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++) {
                this.addMapTile(x, y, spritesList[this.getRandomInt(0, 2)]);
            }
        }

        for(let i = 1; i < 100; i++)
        {
            engine.addEntity(new Entity('', EntityType.Tree, 0, 'tree', this.getRandomInt(i, i* 100), this.getRandomInt(i, i* 100), 75, 80, this.engine.ctx));
        }
    }

    setEngine(engine: Engine) {
        this.engine = engine;
        this.worker.postMessage({
            type: 'data',
            mapSize: this.size,
            minimapTileSize: this.miniMapTileSize,
            mapTilesSize: this.mapTilesSize,
            world: JSON.parse(JSON.stringify(this.engine.world)),
            map: this.map !== undefined? JSON.parse(JSON.stringify(this.map)) : {},
            sprites: this.sprites !== undefined? JSON.parse(JSON.stringify(this.sprites)) : {}
        });
    }

    renderBrackground(screenSection: any) {
        this.worker.postMessage({
            type: 'data',
            view: this.view
        });
        this.worker.postMessage({
            type: 'background',
            screenSection: screenSection
        });
    }

    drawBackground(data: any) {
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

    drawMinimap(data: any) {
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

    minMax(min: number, max: number, value: number) {
        return Math.min(max, Math.max(min, value));
    }

    addMapTile(x: number, y: number, type: string) {
        this.map[x][y] = type;
    }

    getRandomInt(min: number, max: number): number
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
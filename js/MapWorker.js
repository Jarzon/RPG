class Tile {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.color = color;

        this.mapSize = null;
        this.mapTilesSize = null;
        this.minimapTileSize = null;

        this.view = null;
        this.world = null;
        this.map = null;
        this.sprites = null;
    }
}

class MapWorker {
    constructor() {
        let self = this;
        onmessage = function(e) {
            if(e.data.type === 'background') {
                self.background(e.data);
            }
            else if(e.data.type === 'minimap') {
                self.minimap(e.data);
            }
            else if(e.data.type === 'data') {
                self.data(e.data);
            }
        };
    }

    data(data) {
        if(data.view !== undefined) {
            this.view = data.view;
        }
        if(data.mapSize !== undefined) {
            this.mapSize = data.mapSize;
        }
        if(data.mapTilesSize !== undefined) {
            this.mapTilesSize = data.mapTilesSize;
        }
        if(data.mapTilesSize !== undefined) {
            this.mapTilesSize = data.mapTilesSize;
        }
        if(data.minimapTileSize !== undefined) {
            this.minimapTileSize = data.minimapTileSize;
        }
        if(data.world !== undefined) {
            this.world = data.world;
        }
        if(data.map !== undefined) {
            this.map = data.map;
        }
        if(data.sprites !== undefined) {
            this.sprites = data.sprites;
        }
    }

    background() {
        let tiles = [];

        let width = Math.min(this.mapSize, (this.view.position.x + this.view.width) / this.mapTilesSize);
        let height = Math.min(this.mapSize, (this.view.position.y + (this.view.height - this.mapSize)) / this.mapTilesSize);

        for(let x = Math.max(0, Math.floor(this.view.position.x / this.mapTilesSize)); x < width; x++) {
            for(let y = Math.max(0, Math.floor(this.view.position.y / this.mapTilesSize)); y < height; y++) {
                tiles.push({
                    x: ((x * this.mapTilesSize) - this.view.position.x) - this.mapTilesSize,
                    y: ((y * this.mapTilesSize) - this.view.position.y) - this.mapTilesSize,
                    img: this.map[x][y]
                });
            }
        }

        postMessage({type: 'background', 'tiles': tiles});
    }

    minimap(data) {
        let miniMapPosX = this.view.width - this.mapSize;
        let miniMapPosY = this.view.height - this.mapSize;

        let tiles = [];

        for (let x = 0; x < this.mapSize; x += this.minimapTileSize) {
            let xp = x * this.mapTilesSize;
            for (let y = 0; y < this.mapSize; y += this.minimapTileSize) {
                let color = null;
                let yp = y * this.mapTilesSize;

                for(let n = 0; n < this.world.length; n++) {
                    let entity = this.world[n];
                    if (
                        entity.position.x > xp && entity.position.x < xp + this.mapTilesSize * this.minimapTileSize
                        && entity.position.y > yp && entity.position.y < yp + this.mapTilesSize * this.minimapTileSize
                    ) {
                        color = 'rgb(0,0,255)';
                        break;
                    }
                }

                if (color === null) {
                    color = this.sprites[this.map[x][y]].color;
                }

                tiles.push(new Tile(miniMapPosX + x, miniMapPosY + y, this.minimapTileSize, this.minimapTileSize, color));
            }
        }

        postMessage({type: 'minimap', 'tiles': tiles});
    }
}

let mapworker = new MapWorker();
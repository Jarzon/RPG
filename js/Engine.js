class Engine {
    constructor(ctx, controls) {
        this.positions = [];

        this.view = new Panel(12800, 12800, 0, 0);
        this.world = [];

        this.map = [512];
        for(let x = 0; x < 512; x++) {
            this.map[x] = [512];
        }

        this.mapTilesSize = 50;

        this.sprites = {
            'earth': {src: 'earth.png', img: {}},
            'green': {src: 'green.png', img: {}}
        };

        for(let sprite in this.sprites) {
            if(!this.sprites.hasOwnProperty(sprite)) continue;

            let image = new Image();

            image.src = './img/' + this.sprites[sprite].src;

            this.sprites[sprite].img = image;
        }

        this.ctx = ctx;
        this.controls = controls;
        this.freezeControlsFlag = false;

        // Debug

        this.debug = false;
        this.debugTextPoistion = 15;

        // textbox

        this.textboxFlag = false;
        this.textboxText = '';

        // Temp map

        let spritesList = ['earth', 'green'];
        for(let x = 0; x < 512; x++) {
            for(let y = 0; y < 512; y++) {
                this.addMapTile(x, y, spritesList[this.getRandomInt(0, 2)]);
            }
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    update() {
        let self = this;

        // Movements

        if(!this.freezeControlsFlag) {
            if (this.controls.key(W_KEY)) {
                player.move(0, -2);
            }
            else if (this.controls.key(S_KEY)) {
                player.move(0, 2);
            }
            if (this.controls.key(A_KEY)) {
                player.move(-2, 0);
            }
            else if (this.controls.key(D_KEY)) {
                player.move(2, 0);
            }
        }

        // View

        let margin = 20;
        margin = (this.view.height / 100) * margin;

        let relativePos = this.getRelativePosition(player);

        if(relativePos.y < margin) {
            this.moveView(0, -2);
        }
        else if(relativePos.y > this.view.height - margin) {
            this.moveView(0, 2);
        }
        if(relativePos.x < margin) {
            this.moveView(-2, 0);
        }
        else if(relativePos.x > this.view.width - margin) {
            this.moveView(2, 0);
        }

        // Interaction

        if(this.textboxFlag && this.controls.keypress(SPACE)) {
            this.unfreezeControls();
            this.resetTextbox();
        }

        if(this.controls.keypress(SPACE)) {
            this.world.forEach(function (entity) {
                if(entity !== player) {
                    if(player.distance(entity.position) < 22) {
                        entity.interaction();
                    }
                }
            });
        }
    }

    render() {
        this.background();

        let self = this;

        // display entities

        this.world.forEach(function (entity) {
            let pos = self.getRelativePosition(entity);

            entity.display(pos);
        });

        if(this.textboxFlag) {
            this.displayTextbox(this.textboxText);
        }

        // debug overlay

        if(this.debug) {
            this.debugTextPoistion = 15;
            this.debugText('Debug Mode');
        }
    }

    getRelativePosition (entity) {
        let pos = entity.position.clone();

        return pos.sub(this.view.position);
    }

    toggleDebug() {
        if(this.debug) {
            this.debug = false;
        } else {
            this.debug = true;
        }
    }

    moveView(x, y) {
        let vector = new Vector(x, y);

        this.view.move(vector);
    }

    addEntity(entity) {
        this.world.push(entity);
    }

    addCollisionPanel(panel) {
        return this.positions.push(panel) - 1;
    }

    setCollisionPanel(index, panel) {
        this.positions[index] = panel;
    }

    removeCollisionPanel(index) {
        this.positions[index] = undefined;
    }

    freezeControls() {
        this.freezeControlsFlag = true;
    }

    unfreezeControls() {
        this.freezeControlsFlag = false;
    }

    walkable(panel1) {
        let count = this.positions.length;
        for(let n = 0; n < count; n++) {
            let panel2 = this.positions[n];
            if(panel2 !== undefined) {
                if(panel1.position.x < panel2.position.x + panel2.width &&
                    panel1.position.x + panel1.width > panel2.position.x &&
                    panel1.position.y < panel2.position.y + panel2.height &&
                    panel1.height + panel1.position.y > panel2.position.y) {
                    return false;
                }
            }
        }

        return true;
    }

    resize(width, height) {
        this.view.resize(width, height);
    }

    background() {
        let width = Math.min(512, (this.view.position.x + this.view.width) / this.mapTilesSize);
        let height = Math.min(512, (this.view.position.y + this.view.height) / this.mapTilesSize);

        for(let x = Math.max(0, Math.floor(this.view.position.x / this.mapTilesSize)); x < width; x++) {
            for(let y = Math.max(0, Math.floor(this.view.position.y / this.mapTilesSize)); y < height; y++) {
                let sprite = this.sprites[this.map[x][y]].img;

                this.ctx.setTransform(1, 0, 0, 1, ((x * this.mapTilesSize) - this.view.position.x) - this.mapTilesSize, ((y * this.mapTilesSize) - this.view.position.y) - this.mapTilesSize);
                this.ctx.drawImage(sprite, this.mapTilesSize, this.mapTilesSize);
            }
        }

        this.ctx.setTransform(1,0,0,1,0,0);
    }

    addMapTile(x, y, type) {
        this.map[x][y] = type;
    }

    textbox(text) {
        this.freezeControls();
        this.textboxFlag = true;
        this.textboxText = text;
    }

    resetTextbox() {
        this.textboxFlag = false;
        this.textboxText = '';
    }

    displayTextbox(text, margin = 20, borderSize = 5) {
        let boxHeight = 100;

        // TODO: Align the text vertically

        this.ctx.fillStyle = "#000000";

        this.ctx.fillRect(margin, this.view.height - (boxHeight+margin), this.view.width-(margin*2+borderSize), boxHeight);
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(margin+borderSize, this.view.height - (boxHeight+margin-borderSize), this.view.width-(margin*3-borderSize), boxHeight-borderSize*2);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, this.view.width/2, this.view.height - 75);
    }

    debugText(text) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "18px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, 10, this.debugTextPoistion);

        this.debugTextPoistion += 15;
    }
}
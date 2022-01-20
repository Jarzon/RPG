class Engine {
    constructor(ctx, view, map, controls, homeMenu) {
        this.positions = [];

        this.view = view;
        this.map = map;
        this.world = [];

        this.ctx = ctx;
        this.controls = controls;
        this.homeMenu = homeMenu;
        homeMenu.setEngine(this);
        this.freezeControlsFlag = false;

        // Debug

        this.debug = false;
        this.debugTextPoistion = 15;

        // textbox

        this.textboxFlag = false;
        this.textboxText = '';

        this.state = 0;
    }

    initialize() {
        this.homeMenu.initialize();
    }

    update() {
        let self = this;

        // View

        if (this.controls.key(ESC)) {
            this.state = 0;
        }
        if(!this.freezeControlsFlag) {
            if (this.controls.key(W_KEY)) {
                this.moveView(0, -20);
            }
            else if (this.controls.key(S_KEY)) {
                this.moveView(0, 20);
            }
            if (this.controls.key(A_KEY)) {
                this.moveView(-20, 0);
            }
            else if (this.controls.key(D_KEY)) {
                this.moveView(20, 0);
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.view.width, this.view.height);
        if(this.state === 0) {
            this.homeMenu.drawBackground();
            this.homeMenu.draw();
        }
        else if(this.state === 1) {
            this.map.drawBackground();
            let self = this;

            // display entities

            this.world.forEach(function (entity) {
                let pos = self.getRelativePosition(entity);

                entity.display(pos);
            });

            if(this.textboxFlag) {
                this.displayTextbox(this.textboxText);
            }

            this.displayDeck();

            // debug overlay

            if(this.debug) {
                this.debugTextPoistion = 15;
                this.debugText('Debug Mode');
            }
        }
    }

    getRelativePosition (entity) {
        let pos = entity.position.clone();

        return pos.sub(this.view.position);
    }

    toggleDebug() {
        this.debug = !this.debug;
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

    textbox(text) {
        this.freezeControls();
        this.textboxFlag = true;
        this.textboxText = text;
    }

    resetTextbox() {
        this.unfreezeControls();
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

    displayDeck() {
        let boxHeight = 200;

        // Background

        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(0, this.view.height - (boxHeight), this.view.width, boxHeight);

        // map

        this.map.drawMiniature();
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
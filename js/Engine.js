class Engine {
    constructor(ctx, controls) {
        this.positions = [];

        this.view = new Panel(0, 0, 0, 0);
        this.world = [];

        this.ctx = ctx;
        this.controls = controls;

        this.debug = false;
    }

    update() {
        // Movements

        if (this.controls.keys[W_KEY]) {
            player.move(0, -1);
        }
        if (this.controls.keys[S_KEY]) {
            player.move(0, 1);
        }
        if (this.controls.keys[A_KEY]) {
            player.move(-1, 0);
        }
        if (this.controls.keys[D_KEY]) {
            player.move(1, 0);
        }

        // View

        let margin = 20;
        let marginHeight = (this.view.height / 100) * margin;
        let marginWidth = (this.view.width / 100) * margin;

        let relativePos = this.getRelativePosition(player);

        if(relativePos.y < marginHeight) {
            this.moveView(0, -1);
        }
        if(relativePos.y > this.view.height - marginHeight) {
            this.moveView(0, 1);
        }
        if(relativePos.x < marginWidth) {
            this.moveView(-1, 0);
        }
        if(relativePos.x > this.view.width - marginWidth) {
            this.moveView(1, 0);
        }

        // Binds to move the view in debug mode
        if(this.debug) {
            if (this.controls.keys[UPARROW]) {
                this.moveView(0, -2);
            }
            if (this.controls.keys[DOWNARROW]) {
                this.moveView(0, 2);
            }
            if (this.controls.keys[LEFTARROW]) {
                this.moveView(-2, 0);
            }
            if (this.controls.keys[RIGHTARROW]) {
                this.moveView(2, 0);
            }
        }
    }

    render() {
        this.background();

        let self = this;

        this.world.forEach(function (entity) {
            let pos = self.getRelativePosition(entity);

            entity.display(pos);
        });
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
        this.ctx.fillStyle = '#222222';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    textbox(text, margin = 20, borderSize = 5) {
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
}
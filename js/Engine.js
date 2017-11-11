class Engine {
    constructor(ctx, controls) {
        this.width = 0;
        this.height = 0;

        this.positions = [];

        this.view = new Panel(0, 0, 0, 0);
        this.world = [];

        this.ctx = ctx;
        this.controls = controls;
    }

    render() {
        this.background();

        let self = this;

        this.world.forEach(function (entity) {
            let pos = entity.position.clone();

            pos.sub(self.view.position);

            entity.display(entity.position);
        });

        if (this.controls.keys[UPARROW]) {
            player.move(0, -1);
        }
        if (this.controls.keys[DOWNARROW]) {
            player.move(0, 1);
        }
        if (this.controls.keys[LEFTARROW]) {
            player.move(-1, 0);
        }
        if (this.controls.keys[RIGHTARROW]) {
            player.move(1, 0);
        }
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

        this.width = width;
        this.height = height;
    }

    background() {
        this.ctx.fillStyle = '#222222';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    textbox(text, margin = 20, borderSize = 5) {
        let boxHeight = 100;

        // TODO: Align the text vertically

        this.ctx.fillStyle = "#000000";

        this.ctx.fillRect(margin, this.height - (boxHeight+margin), this.width-(margin*2+borderSize), boxHeight);
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(margin+borderSize, this.height - (boxHeight+margin-borderSize), this.width-(margin*3-borderSize), boxHeight-borderSize*2);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, this.width/2, this.height - 75);
    }
}
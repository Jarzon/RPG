class Engine {
    constructor(ctx) {
        this.width = 0;
        this.height = 0;

        this.positions = [];

        this.ctx = ctx;
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

    walkable(panel1, selfIndex) {
        let count = this.positions.length;
        for(let n = 0; n < count; n++) {
            let panel2 = this.positions[n];
            if(panel2 !== undefined) {
                if(panel1.x < panel2.x + panel2.width &&
                    panel1.x + panel1.width > panel2.x &&
                    panel1.y < panel2.y + panel2.height &&
                    panel1.height + panel1.y > panel2.y) {
                    this.textbox("cant walk ");
                    return false;
                }
            }
        }

        return true;
    }

    resize(width, height) {
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
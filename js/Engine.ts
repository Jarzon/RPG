class Engine {
    positions: Array<any>;
    lastCalledTime: number;
    fps: number;
    view: Panel;
    map: any;
    world: Array<any>;
    ctx: any;
    controls: Controls;
    homeMenu: any;
    freezeControlsFlag: boolean;
    didAlreadyDraw: boolean;
    debug: boolean;
    debugTextPoistion: number;
    textboxFlag: boolean;
    textboxText: string;
    state: number;

    constructor(ctx: any, view: any, map: any, controls: Controls, homeMenu: any) {
        this.positions = [];
        this.lastCalledTime = 0;
        this.fps = 0;

        this.view = view;
        this.map = map;
        this.world = [];

        this.ctx = ctx;
        this.controls = controls;
        this.homeMenu = homeMenu;
        this.freezeControlsFlag = false;
        this.didAlreadyDraw = false;

        // Debug

        this.debug = false;
        this.debugTextPoistion = 15;

        // textbox

        this.textboxFlag = false;
        this.textboxText = '';

        this.state = 0;

        map.setEngine(this);
        homeMenu.setEngine(this);
    }

    initialize() {
        this.homeMenu.initialize();
    }

    tick(now: number) {
        this.didAlreadyDraw = false;
        let delta = (now - this.lastCalledTime) / 1000;
        this.lastCalledTime = now;
        this.fps = 1 / delta;

        this.debugTextPoistion = 15;
        this.update();
        this.draw();
    }

    update() {
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

    draw(screenSection: any = undefined) {
        if(this.didAlreadyDraw) return;

        if(this.state === 0) {
            this.homeMenu.draw();
        }
        else if(this.state === 1) {
            this.mouseInteractions();
            this.map.renderBrackground(screenSection);
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
        this.didAlreadyDraw = true;
    }

    mouseInteractions() {
        if(this.controls.key(MOUSE_LEFT)) {
            for(let n = 0; n < this.world.length; n++) {
                this.world[n].select(this.world[n].isUnder(this.controls.mouse));
            }
        }
    }

    getRelativePosition (entity: any) {
        let pos = entity.position.clone();

        return pos.sub(this.view.position);
    }

    toggleDebug() {
        this.debug = !this.debug;
    }

    moveView(x: number, y: number) {
        let vector = new Vector(x, y);

        this.view.move(vector);
    }

    addEntity(entity: any) {
        this.world.push(entity);
    }

    move(entity: any, x: number, y: number) {
        let vector = new Vector(x, y);

        let destination = entity.position.clone().add(vector);

        if(this.walkable(destination)) {
            entity.position.add(vector);
        }
    }

    walkable(destination: any) {
        let count = this.world.length;
        for(let n = 0; n < count; n++) {
            let entity = this.world[n];
            return destination.isUnder(entity);
        }

        return true;
    }

    addCollisionPanel(panel: any) {
        return this.positions.push(panel) - 1;
    }

    setCollisionPanel(index: number, panel: any) {
        this.positions[index] = panel;
    }

    removeCollisionPanel(index: number) {
        this.positions[index] = undefined;
    }

    freezeControls() {
        this.freezeControlsFlag = true;
    }

    unfreezeControls() {
        this.freezeControlsFlag = false;
    }

    resize(width: number, height: number) {
        this.view.resize(width, height);
        this.homeMenu.reinitialize();
    }

    textbox(text: string) {
        this.freezeControls();
        this.textboxFlag = true;
        this.textboxText = text;
    }

    resetTextbox() {
        this.unfreezeControls();
        this.textboxFlag = false;
        this.textboxText = '';
    }

    displayTextbox(text: string, margin: number = 20, borderSize: number = 5) {
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
        // Background

        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(0, this.view.height - (this.map.size), this.view.width, this.map.size);

        // map

        this.map.renderMiniMap();
    }

    debugText(text: string, pos: number = 15) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "18px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, 10, pos);
    }
}
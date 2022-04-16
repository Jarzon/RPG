class Engine {
    positions: Array<any>;
    lastCalledTime: number;
    fps: number;
    view: Panel;
    map: any;
    world: Array<Entity> = [];
    worldView: Array<Entity> = [];
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
    contextMenu: Vector = null;
    selected: Entity = null;

    constructor(ctx: any, view: any, map: any, controls: Controls, homeMenu: any) {
        this.positions = [];
        this.lastCalledTime = 0;
        this.fps = 0;

        this.view = view;
        this.map = map;

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

        this.reorderWorldView();

        // animate enities
        for(let n = 0; n < this.world.length; n++) {
            this.world[n].think();
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

            let n = 0;

            this.worldView.forEach((entity:Entity) => {
                if(!entity.position.colision(this.view)) {
                    return;
                }
                let pos = self.getRelativePosition(entity);

                n++;

                entity.display(pos);
            });

            this.debugText('Nombre entité : ' + n)

            if(this.textboxFlag) {
                this.displayTextbox(this.textboxText);
            }

            this.displayDeck();

            // debug overlay

            if(this.debug) {
                this.debugTextPoistion = 15;
                this.debugText('Debug Mode');
            }
            if(this.contextMenu !== null) {
                this.showContextMenu();
            }
        }
        this.didAlreadyDraw = true;
    }

    mouseInteractions() {
        if(this.controls.key(MOUSE_LEFT)) {
            for(let n = 0; n < this.world.length; n++) {
                if(this.world[n].select(this.world[n].isUnder(this.controls.mouse))) {
                    this.selected = this.world[n];
                }
            }
        }
        else if(this.controls.key(MOUSE_RIGHT)) {
            if(this.selected !== null) {
                let target = null;
                for(let n = 0; n < this.world.length; n++) {
                    if(this.world[n].select(this.world[n].isUnder(this.controls.mouse))) {
                        target = this.world[n];
                        break;
                    }
                }
                if(target !== null && target !== this.selected) {
                    this.selected.target = target;
                }
                this.selected.moveTo = this.controls.mouse.clone();
            }
        }
    }

    getRelativePosition (entity: Entity) {
        let pos = entity.position.clone();

        return pos.position.sub(this.view.position);
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
        this.worldView.push(entity);
        this.reorderWorldView();
    }

    reorderWorldView() {
        this.worldView.sort((a: Entity, b: Entity) => {
            return a.position.position.y - b.position.position.y;
        });
    }

    move(entity: Entity, x: number, y: number) {
        let vector = new Vector(x, y);

        let destination = entity.position.position.clone().add(vector);

        if(this.walkable(destination)) {
            entity.position.position.add(vector);
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
        let bottomPos = this.view.height - (this.map.size);

        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(0, bottomPos, this.view.width, this.map.size);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "left";
        let linePos = bottomPos + 30;
        if(this.selected !== null) {
            this.ctx.fillText('Nom : ' + this.selected.name, 20, linePos);
            linePos += 30;
            this.ctx.fillText('Vie : ' + this.selected.maxLife, 20, linePos);
            linePos += 30;
            this.ctx.fillText('Bois : ' + this.selected.resources.wood, 20, linePos);
            linePos += 30;
            this.ctx.fillText('Nourriture : ' + this.selected.resources.food, 20, linePos);
            linePos += 30;
            this.ctx.fillText('Pierres : ' + this.selected.resources.stone, 20, linePos);
            linePos += 30;
            this.ctx.fillText('Or : ' + this.selected.resources.gold, 20, linePos);
            linePos += 30;
        }

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

    showContextMenu() {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "18px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillRect(this.contextMenu.x, this.contextMenu.y, 100, 200);
        //this.ctx.fillText(text, this.contextMenu.x, this.contextMenu.y);
    }
}
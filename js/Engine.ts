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
    menuPosition: number = 0;
    menu: Array<TextElement> = [];
    buildSelection: Entity;

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
        homeMenu.setEngine(this);
        map.setEngine(this);
    }

    initialize() {
        this.homeMenu.initialize();
        this.menuPosition = this.view.height - (this.map.size);

        this.menu.push(new TextElement('Forum', 'left', 20, this.menuPosition + 21, () => {
           this.buildSetup(new Building(0, 0, 80, 80, this.ctx));
        }, this.ctx))
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

                entity.display(pos, this.debug);
            });

            if(this.textboxFlag) {
                this.displayTextbox(this.textboxText);
            }

            this.displayDeck();

            // debug overlay

            if(this.debug) {
                this.debugTextPoistion = 15;
                this.debugText('Debug Mode');
                this.debugText('Nombre entité : ' + n);
            }
            if(this.contextMenu !== null) {
                this.showContextMenu();
            }
        }
        this.didAlreadyDraw = true;
    }

    mouseInteractions() {
        // Mouse is in the deck
        if(this.controls.absMouse.y >= this.menuPosition) {
            if(this.selected instanceof Villager) {
                for(let menu of this.menu) {
                    menu.mouseCollision(this.controls);
                }
            }
        } else {
            if(this.controls.key(MOUSE_LEFT)) {
                // select entity
                for(let n = 0; n < this.world.length; n++) {
                    if(this.world[n].select(this.world[n].isUnder(this.controls.mouse))) {
                        this.selected = this.world[n];
                    }
                }
                if(this.buildSelection !== null) {
                    this.buildSelection = null;
                }
            }
            else if(this.controls.key(MOUSE_RIGHT)) {
                if(this.buildSelection !== null) {
                    this.build(this.buildSelection, this.controls.mouse);
                    this.buildSelection = null;
                }
                else if(this.selected !== null) {
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

        if(this.controls.key(MOUSE_LEFT)) {
            // Mouse is in the deck

        }
        else if(this.controls.key(MOUSE_RIGHT)) {

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

    buildSetup(building: Entity)
    {
        this.buildSelection = building;
    }

    build(building: Entity, mouse: Vector)
    {
        building.position.position.x = mouse.x;
        building.position.position.y = mouse.y;
        this.addEntity(building);
    }

    displayDeck() {
        // Background
        let bottomPos = this.menuPosition = this.view.height - (this.map.size);

        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(0, bottomPos, this.view.width, this.map.size);

        this.ctx.strokeStyle = "#fff";
        if(this.selected instanceof Villager) {
            for(let menu of this.menu) {
                menu.displayTextbox();
            }
        }

        this.ctx.fillStyle = "#fff";

        this.ctx.textAlign = "left";

        const middleDeck = this.view.width / 4;
        let linePos = bottomPos + 30;
        if(this.selected !== null) {
            this.ctx.fillText('Nom : ' + this.selected.name, middleDeck, linePos);
            linePos += 30;
            this.ctx.fillText('Vie : ' + this.selected.maxLife, middleDeck, linePos);
            linePos += 30;
            this.ctx.fillText('Bois : ' + Math.ceil(this.selected.resources.wood), middleDeck, linePos);
            linePos += 30;
            this.ctx.fillText('Nourriture : ' + Math.ceil(this.selected.resources.food), middleDeck, linePos);
            linePos += 30;
            this.ctx.fillText('Pierres : ' + Math.ceil(this.selected.resources.stone), middleDeck, linePos);
            linePos += 30;
            this.ctx.fillText('Or : ' + Math.ceil(this.selected.resources.gold), middleDeck, linePos);
            linePos += 30;
        }

        // map

        this.map.renderMiniMap();
    }

    debugText(text: string, pos: number = null) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "18px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, 10, pos ? pos : this.debugTextPoistion);
        this.debugTextPoistion += 20;
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
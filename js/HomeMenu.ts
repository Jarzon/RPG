class HomeMenu {
    ctx: any;
    controls: any;
    menuHeight: number;
    menu: Array<any>;
    engine: Engine;

    constructor(ctx: any, controls: any) {
        this.ctx = ctx;
        this.controls = controls;
        this.menuHeight = 0;
        this.menu = [];
    }

    addMenuElement(text: any, callback: any) {
        let el = new TextElement(
            text,
            'center',
            this.engine.view.width / 2,
            this.menuHeight,
            callback,
            this.ctx,
            20
        );

        this.menu.push(el);

        this.menuHeight += el.position.height;
    }

    reinitialize() {
        this.menu = [];
        this.initialize();
    }

    initialize() {
        let self = this;
        this.menuHeight = this.engine.view.height/3;

        this.addMenuElement('Play', () => {
            self.engine.state = 1;
            this.engine.map.generateMap();
            this.engine.map.setEngine(this.engine);
        });

        this.addMenuElement('Options', () => {

        });

        this.addMenuElement('Quit',  () => {
            if(confirm('Êtes vous sur de vouloir quitter ?')) {
                window.close();
            }
        });
    }

    setEngine(engine: Engine) {
        this.engine = engine;
    }

    draw() {
        this.drawBackground();

        for(let text of this.menu) {
            text.displayTextbox();
            text.mouseCollision(this.controls);
        }
    }

    drawBackground()
    {
        this.ctx.fillStyle = 'hsl(212, 50%, 30%)';

        this.ctx.fillRect(
            0,
            0,
            this.engine.view.width,
            this.engine.view.height
        );

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
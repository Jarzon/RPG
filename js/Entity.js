class Entity {
    constructor(x, y, ctx, engine) {
        this.position = new Vector(x, y);

        this.height = 38;
        this.width = 20;

        this.imgReady = false;
        let image = new Image();

        image.onload = function (self) {
            self.imgReady = true;
        }(this);
        image.src = "./img/stickman.png";

        this.image = image;
        this.ctx = ctx;

        this.engine = engine;

        this.hitboxPanelIndex = 0;

        this.setHitbox();
    }

    setHitbox() {
        if(this.hitboxPanelIndex === 0) {
            this.hitboxPanelIndex = this.engine.addCollisionPanel(this.getHitbox());
        } else {
            this.engine.setCollisionPanel(this.hitboxPanelIndex, this.getHitbox());
        }
    }

    removeHitbox() {
        this.engine.removeCollisionPanel(this.hitboxPanelIndex);
    }

    getHitbox() {
        return new Panel(this.position.x, this.position.y, this.width, this.height);
    }

    move(x, y) {
        let vector = new Vector(x, y);

        let destination = this.getHitbox();
        destination.move(vector);

        this.removeHitbox();

        if(this.engine.walkable(destination)) {
            this.position.add(vector);
        }

        this.setHitbox();
    }

    distance(position) {
        if(position instanceof Vector === false) {
            position = position.position;
        }
        position = position.clone();
        position.sub(this.position);
        return position.magnitude() - (this.height / 2);
    }

    display(position) {
        if (this.imgReady) {
            this.ctx.setTransform(1, 0, 0, 1, position.x, position.y);
            this.ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
            this.ctx.setTransform(1,0,0,1,0,0);
        }
    }

    interaction() {
        this.engine.textbox('hello world');
    }
}
class Entity {
    position: Panel;
    image: any
    ctx: any;
    imgReady: boolean
    selected: boolean;
    speed: number = 0;
    life: number;
    maxLife: number;
    moveTo: Vector = null;
    name: string;
    direction: number = 1;
    target: Entity = null;
    type: EntityType;
    resources: Resources;

    constructor(name: string, type: EntityType, speed: number, imageFile: string, x: number, y: number, width: number, height: number, ctx: any) {
        this.position = new Panel(x, y, width, height);

        this.name = name;
        this.life = this.maxLife = 100;

        this.imgReady = false;
        let image = new Image();

        image.onload = function (self): any {
            self.imgReady = true;
        }(this);
        image.src = `./img/${imageFile}.png`;

        this.image = image;
        this.ctx = ctx;
        this.selected = false;

        this.speed = speed;
        this.type = type;
        this.resources = new Resources();
    }

    think() {
        this.action();
        this.move();
    }

    action() {
        if(this.target !== null) {
            if(this.position.colision(this.target.position)) {
                // action
                if(this.target.type === EntityType.Tree) {
                    this.resources.wood += 1;
                }
            }
        }
    }

    move() {
        if(this.speed > 0 && this.moveTo !== null) {
            if(this.target !== null && this.position.colision(this.target.position)) return;
            let x = 0;
            let y = 0;
            if(this.position.position.x < this.moveTo.x) {
                x += 1;
                this.direction = 1;
            }
            else if(this.position.position.x > this.moveTo.x) {
                x -= 1;
                this.direction = -1;
            }
            if(this.position.position.y < this.moveTo.y) {
                y += 1;
            }
            else if(this.position.position.y > this.moveTo.y) {
                y -= 1;
            }
            let movement = new Vector(x, y);
            this.position.position.add(movement);

            if(this.position.position.equals(this.moveTo)) {
                this.moveTo = null;
            }
        }
    }

    distance(position: any) {
        if(position instanceof Vector === false) {
            position = position.position;
        }
        position = position.clone();
        position.sub(this.position);
        return position.magnitude() - (this.position.height / 2);
    }

    display(position: any) {
        if (this.imgReady) {
            if(this.selected) {
                this.ctx.beginPath();
                this.ctx.ellipse(position.x, position.y + this.position.height / 2, 20, 10, 2 * Math.PI, 2 * Math.PI, false);
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.stroke();
            }

            this.ctx.setTransform(this.direction, 0, 0, 1, position.x, position.y);
            this.ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
            this.ctx.setTransform(1,0,0,1,0,0);
        }
    }

     isUnder(x: any, y:number = null) {
        if(y === null) {
            y = x.y;
            x = x.x;
        }
        return x > this.position.position.x - this.position.height
            && y > this.position.position.y - this.position.width
            && x < (this.position.position.x + this.position.height)
            && y < (this.position.position.y + this.position.width);
    }

    select(selected: boolean): boolean {
        return this.selected = selected;
    }
}
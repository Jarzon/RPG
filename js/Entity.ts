class Entity {
    position: Vector;
    height: number;
    width: number;
    image: any
    ctx: any;
    imgReady: boolean
    selected: boolean;
    speed: number;
    life: number;
    maxLife: number;
    moveTo: Vector = null;
    name: string;
    direction: number = 1;

    constructor(name: string, x: number, y: number, width: number, height: number, ctx: any) {
        this.position = new Vector(x, y);

        this.name = name;
        this.life = this.maxLife = 100;

        this.height = height;
        this.width = width;

        this.imgReady = false;
        let image = new Image();

        image.onload = function (self): any {
            self.imgReady = true;
        }(this);
        image.src = "./img/stickman.png";

        this.image = image;
        this.ctx = ctx;
        this.selected = false;

        this.speed = 100;
    }

    move() {
        if(this.moveTo !== null) {
            let x = 0;
            let y = 0;
            if(this.position.x < this.moveTo.x) {
                x += 1;
                this.direction = 1;
            }
            else if(this.position.x > this.moveTo.x) {
                x -= 1;
                this.direction = -1;
            }
            if(this.position.y < this.moveTo.y) {
                y += 1;
            }
            else if(this.position.y > this.moveTo.y) {
                y -= 1;
            }
            let movement = new Vector(x, y);
            this.position.add(movement);

            if(this.position.equals(this.moveTo)) {
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
        return position.magnitude() - (this.height / 2);
    }

    display(position: any) {
        if (this.imgReady) {
            if(this.selected) {
                this.ctx.beginPath();
                this.ctx.ellipse(position.x, position.y + this.height / 2, 20, 10, 2 * Math.PI, 2 * Math.PI, false);
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
        return x > this.position.x - this.height
            && y > this.position.y - this.width
            && x < (this.position.x + this.height)
            && y < (this.position.y + this.width);
    }

    select(selected: boolean): boolean {
        return this.selected = selected;
    }
}
class Entity {
    position: Vector;
    height: number;
    width: number;
    image: any
    ctx: any;
    imgReady: boolean
    selected: boolean;
    speed: number;
    moveTo: Vector = null;

    constructor(x: number, y: number, width: number, height: number, ctx: any) {
        this.position = new Vector(x, y);

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
            this.position = this.moveTo;
            this.moveTo = null;
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

            this.ctx.setTransform(1, 0, 0, 1, position.x, position.y);
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

    select(selected: boolean) {
        this.selected = selected;
    }
}
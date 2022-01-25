class Entity {
    constructor(x, y, width, height, ctx) {
        this.position = new Vector(x, y);

        this.height = height;
        this.width = width;

        this.imgReady = false;
        let image = new Image();

        image.onload = function (self) {
            self.imgReady = true;
        }(this);
        image.src = "./img/stickman.png";

        this.image = image;
        this.ctx = ctx;
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

     isUnder(x, y = null) {
        if(y === null) {
            y = x.y;
            x = x.x;
        }
        return x > this.position.x - this.height
            && y > this.position.y - this.width
            && x < (this.position.x + this.height)
            && y < (this.position.y + this.width);
    }
}
class Walker {
    constructor(x, y, ctx) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        this.maxspeed = 1.0;
        this.maxforce = 0.1;

        this.size = 40;

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
        return position.magnitude();
    }

    display() {
        if (this.imgReady) {
            this.ctx.setTransform(1.5, 0, 0, 1.5, this.position.x, this.position.y);
            this.ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
            this.ctx.setTransform(1,0,0,1,0,0);
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.multiply(0);
    }

    say (message) {
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(message, this.position.x + this.size, this.position.y);
    }
}
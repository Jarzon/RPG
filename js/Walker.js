class Walker {
    constructor(x, y, ctx) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        this.maxspeed = 1.0;
        this.maxforce = 0.1;

        this.size = 30;

        this.imgReady = false;
        let image = new Image();

        image.onload = function (self) {
            self.imgReady = true;
        }(this);
        image.src = "./img/ant.png";

        this.image = image;
        this.ctx = ctx;
    }

    display() {
        if (this.imgReady) {
            this.ctx.setTransform(0.2, 0, 0, 0.2, this.position.x, this.position.y);
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

    seek(target) {
        let desired = target.clone();
        desired.sub(this.position);
        let d = desired.magnitude();
        desired.normalize();
        if (d < 100) {
            let m = this.map(d,0,100,0,this.maxspeed);
            desired.multiply(m);
        } else {
            desired.multiply(this.maxspeed);
        }

        let steer = desired.clone();
        steer.sub(this.velocity);
        steer.limit(this.maxforce);

        this.applyForce(steer);
    }

    map(value, istart, istop, ostart, ostop) {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }

    say (message) {
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(message, this.position.x + this.size, this.position.y);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }
}
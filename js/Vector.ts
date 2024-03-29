class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    equals(vector: Vector): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    add(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    sub(vector: Vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    divide(vector: Vector|number) {
        if (vector instanceof Vector) {
            if(vector.x !== 0) this.x /= vector.x;
            if(vector.y !== 0) this.y /= vector.y;
        } else {
            if(vector !== 0) {
                this.x /= vector;
                this.y /= vector;
            }
        }

        return this;
    }

    multiply(vector: Vector|number) {
        if (vector instanceof Vector) {
            this.x *= vector.x;
            this.y *= vector.y;
        } else {
            this.x *= vector;
            this.y *= vector;
        }

        return this;
    }

    dot(vector: Vector) {
        return (this.x * vector.x) + (this.y * vector.y);
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.divide(this.length());
    }

    heading() {
        return (-Math.atan2(-this.y, this.x));
    }

    magnitude() {
        let x = this.x,
            y = this.y;

        return Math.sqrt(x * x + y * y);
    }

    limit(value: number) {
        if (this.magnitude() > value) {
            this.normalize();
            this.multiply(value);
        }
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    set(x: number, y: number) {
        this.x = x; this.y = y;
        return this;
    }
}
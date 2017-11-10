class Panel {
    constructor(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    move(vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    clone() {
        return new Panel(this.x, this.y, this.width, this.height);
    }
}
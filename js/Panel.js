class Panel {
    constructor(x, y, width, height) {
        this.position = new Vector(x, y);

        this.width = width || 0;
        this.height = height || 0;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    move(x, y) {
        let vector = new Vector(x, y);
        this.position.add(vector);

        return this;
    }

    clone() {
        return new Panel(this.position.x, this.position.y, this.width, this.height);
    }
}
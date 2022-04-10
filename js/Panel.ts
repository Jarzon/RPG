class Panel {
    position: Vector;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number) {
        this.position = new Vector(x, y);

        this.width = width || 0;
        this.height = height || 0;
    }

    colision(targetPanel: Panel): boolean
    {
        if(
            this.position.x + this.width >= targetPanel.position.x
            && this.position.x <= targetPanel.position.x + targetPanel.width
            && this.position.y + this.height >= targetPanel.position.y
            && this.position.y <= targetPanel.position.y + targetPanel.height
        ) {
            return true;
        }

        return false;
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    move(vector: Vector) {
        this.position.add(vector);

        return this;
    }

    clone() {
        return new Panel(this.position.x, this.position.y, this.width, this.height);
    }
}
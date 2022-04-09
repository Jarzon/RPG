class Controls {
    constructor(view) {
        this.view = view;
        this.keys = {};
        this.keyFlags = {};
        this.mouse = new Vector(0, 0);
    }

    keypress(key) {
        if(this.key(key) && this.keyFlags[key]) {
            this.keyFlags[key] = false;
            return true;
        }
        return false;
    }

    key(key) {
        return this.keys[key];
    }

    keydown(key) {
        if(!this.key(key)) {
            if(!this.keyFlags[key]) {
                this.keyFlags[key] = true;
            }
            this.keys[key] = true;
        }
    }

    keyup(key) {
        this.keys[key] = false;
    }

    setMousePosition(x, y) {
        this.mouse.set(this.view.position.x + x, this.view.position.y +y);
    }
}
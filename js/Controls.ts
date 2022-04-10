class Controls {
    view: Panel;
    keys: any;
    keyFlags: any;
    mouse: Vector;

    constructor(view: Panel) {
        this.view = view;
        this.keys = {};
        this.keyFlags = {};
        this.mouse = new Vector(0, 0);
    }

    keypress(key: string) {
        if(this.key(key) && this.keyFlags[key]) {
            this.keyFlags[key] = false;
            return true;
        }
        return false;
    }

    key(key: string) {
        return this.keys[key];
    }

    keydown(key: string) {
        if(!this.key(key)) {
            if(!this.keyFlags[key]) {
                this.keyFlags[key] = true;
            }
            this.keys[key] = true;
        }
    }

    keyup(key: string) {
        this.keys[key] = false;
    }

    setMousePosition(x: number, y: number) {
        this.mouse.set(this.view.position.x + x, this.view.position.y +y);
    }
}
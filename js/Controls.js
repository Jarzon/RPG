class Controls {
    constructor() {

        this.keys = {};
        this.keyFlags = {};
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
}
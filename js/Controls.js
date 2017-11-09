class Controls {
    constructor() {
        this.keys = [222];
    }

    keypress(key) {
        this.keys[key] = true;
    }

    keyreleash(key) {
        this.keys[key] = false;
    }
}
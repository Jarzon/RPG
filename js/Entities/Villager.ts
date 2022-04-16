class Villager extends Entity {
    constructor(name: string, type: EntityType, speed: number, imageFile: string, x: number, y: number, width: number, height: number, ctx: any) {
        super(name, type, speed, imageFile, x, y, width, height, ctx);
    }

    action() {
        if(this.target !== null) {
            if(this.position.colision(this.target.position)) {
                // action
                if(this.target.type === EntityType.Tree) {
                    this.resources.wood += 0.005;
                }
            }
        }
    }
}
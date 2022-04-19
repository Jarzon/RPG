class Villager extends Entity {
    resources: Resources;

    constructor(name: string, type: EntityType, speed: number, imageFile: string, x: number, y: number, width: number, height: number, ctx: any) {
        super(name, type, speed, 100, imageFile, x, y, width, height, ctx);

        this.resources = new Resources();
    }

    action() {
        if(this.target !== null) {
            if(this.position.colision(this.target.position)) {
                // action
                if(this.target.type === EntityType.Tree) {
                    this.resources.wood += 0.005;
                }
                else if(this.target.type === EntityType.Building) {
                    this.target.remainingBuild -= 0.05;
                }
            }
        }
    }
}
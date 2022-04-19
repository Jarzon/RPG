class Building extends Entity {
    constructor(x: number, y: number, width: number, height: number, ctx: any) {
        super('Building', EntityType.Building, 0, 'building', x, y, width, height, ctx);
    }

    action() {}

    move() {}
}
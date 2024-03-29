class Building extends Entity {

    constructor(buildTime: number, x: number, y: number, width: number, height: number, ctx: any) {
        super('Building', EntityType.Building, 0, buildTime, 'building', x, y, width, height, ctx);
    }

    getRemaingBuild(): number
    {
        return -(Math.ceil(this.remainingBuild) - this.initialBuild);
    }

    action() {}

    move() {}
}
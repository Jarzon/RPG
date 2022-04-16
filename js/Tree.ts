class Tree extends Entity {
    constructor(x: number, y: number, width: number, height: number, ctx: any) {
        super('Arbre', EntityType.Tree, 0, 'tree', x, y, width, height, ctx);
    }

    action() {
        return;
    }
}
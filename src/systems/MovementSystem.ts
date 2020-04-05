import { Entity, Family, IteratingSystem } from "typed-ecstasy";

import { VelocityComponent, PositionComponent } from "../components";

export class MovementSystem extends IteratingSystem {
    constructor() {
        super(Family.all(PositionComponent, VelocityComponent).get());
    }

    protected processEntity(entity: Entity, deltaTime: number) {
        const vc = entity.get(VelocityComponent);
        const pc = entity.get(PositionComponent);
        if (!vc || !pc) return;

        pc.position.x += vc.dir.x * deltaTime;
        pc.position.y += vc.dir.y * deltaTime;
        pc.rotation += vc.rotation * deltaTime;

        // correct position
        if (pc.position.x < 0) pc.position.x += 800;
        else if (pc.position.x >= 800) pc.position.x -= 800;
        if (pc.position.y < 0) pc.position.y += 600;
        else if (pc.position.y >= 600) pc.position.y -= 600;

        // calculate all 4 other (portal-ish) positions
        const xFactor = pc.position.x < 400 ? 1 : -1;
        const yFactor = pc.position.y < 300 ? 1 : -1;
        const x2 = pc.position.x + 800 * xFactor;
        const y2 = pc.position.y + 600 * yFactor;
        pc.positions[0].set(pc.position.x, pc.position.y);
        pc.positions[1].set(x2, pc.position.y);
        pc.positions[2].set(pc.position.x, y2);
        pc.positions[3].set(x2, y2);
    }
}

import type { AsteroidsEntityConfig } from "../types";

export const extraLifeBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "item_extralife" }],
        layer: "powerups",
        popTime: 0.2,
    },
    LifeTime: {
        lifeTime: 10,
    },
    Powerup: {
        extraLifes: 1,
    },
    Physics: {
        radius: 14,
        group: "powerup",
    },
    Sounds: {
        pickup: "item_powerup",
    },
};

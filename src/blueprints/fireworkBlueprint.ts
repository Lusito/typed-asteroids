import type { AsteroidsEntityConfig } from "../types";

export const fireworkBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "particle" }],
        layer: "splitter",
        popTime: 0.5,
        scale: 0.3,
    },
    DeathSpawns: {
        entity: "firework_splitter",
        countMin: 8,
        countMax: 8,
        speedMin: 30,
        speedMax: 40,
    },
    LifeTime: {
        lifeTime: 1, // will be random
    },
};

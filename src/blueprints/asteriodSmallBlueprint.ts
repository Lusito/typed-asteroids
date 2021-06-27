import type { AsteroidsEntityConfig } from "../types";

export const asteroidSmallBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "small" }],
        layer: "small_asteroids",
        scale: 0.75,
        popTime: 0.2,
    },
    DeathSpawns: {
        entity: "asteroid_splitter",
        countMin: 6,
        countMax: 6,
        speedMin: 10,
        speedMax: 10,
    },
    Physics: {
        radius: 11,
        group: "asteroid",
    },
    Sounds: {
        die: "explode_small",
    },
};

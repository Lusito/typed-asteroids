import type { AsteroidsEntityConfig } from "../types";

export const asteroidMediumBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "medium" }],
        layer: "medium_asteroids",
        scale: 0.75,
        popTime: 0.2,
    },
    DeathSpawns: {
        entity: "asteroid_small",
        countMin: 3,
        countMax: 3,
        speedMin: 10,
        speedMax: 10,
    },
    Physics: {
        radius: 22,
        group: "asteroid",
    },
    Sounds: {
        die: "explode_big",
    },
};

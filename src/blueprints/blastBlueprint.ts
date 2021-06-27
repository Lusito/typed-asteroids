import type { AsteroidsEntityConfig } from "../types";

export const blastBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "blast" }],
        layer: "blasts",
        scale: 0.48,
        popTime: 0,
    },
    LifeTime: {
        lifeTime: 1,
    },
    Physics: {
        radius: 9,
        group: "blast",
        collidesWith: ["asteroid"],
    },
    Sounds: {
        spawn: "snd_shot",
    },
};

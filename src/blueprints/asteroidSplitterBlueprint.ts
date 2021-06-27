import type { AsteroidsEntityConfig } from "../types";

export const asteroidSplitterBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "small" }],
        layer: "splitter",
        scale: 0.25,
        popTime: 0,
    },
    LifeTime: {
        lifeTime: 0.3,
    },
};

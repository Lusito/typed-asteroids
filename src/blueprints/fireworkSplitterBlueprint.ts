import type { AsteroidsEntityConfig } from "../types";

export const fireworkSplitterBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "particle" }],
        layer: "splitter",
        popTime: 1,
        scale: 0.6,
    },
    LifeTime: {
        lifeTime: 1,
    },
};

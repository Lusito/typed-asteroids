import { Container } from "pixi.js";

import { BaseState } from "./BaseState";

export class StateManager {
    private stage: Container;

    private states: BaseState[] = [];

    public constructor(stage: Container) {
        this.stage = stage;
    }

    public destroy() {
        for (const state of this.states) {
            state.destroy();
        }
        this.states = [];
    }

    public getStage() {
        return this.stage;
    }

    public addState(state: BaseState) {
        const index = this.states.indexOf(state);
        if (index === -1) this.states.push(state);
    }

    public removeState(state: BaseState) {
        const index = this.states.indexOf(state);
        if (index !== -1) this.states.splice(index, 1);
    }

    public update(deltaTime: number) {
        for (const state of this.states) {
            if (state.isVisible()) state.update(deltaTime);
        }
    }
}

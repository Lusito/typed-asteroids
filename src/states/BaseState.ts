import { Container } from "pixi.js";

import type { StateManager } from "./StateManager";

export class BaseState {
    manager: StateManager;

    protected container: Container;

    public constructor(manager: StateManager) {
        this.container = new Container();
        manager.getStage().addChild(this.container);
        manager.addState(this);
        this.manager = manager;
    }

    public destroy() {
        this.manager.removeState(this);
        this.container.destroy();
    }

    public setVisible(visible: boolean) {
        this.container.visible = visible;
    }

    public isVisible() {
        return this.container.visible;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update(_deltaTime: number) {}
}

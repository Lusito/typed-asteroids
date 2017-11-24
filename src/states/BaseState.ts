/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Container } from "pixi.js";
import { StateManager } from "./StateManager";

export class BaseState {
    manager: StateManager;
    protected container: Container;
    public constructor(manager: StateManager) {
        this.container = new Container();
        manager.getStage().addChild(this.container);
        manager.addState(this);
        this.manager = manager;
    }

    public destroy(): void {
        this.manager.removeState(this);
        this.container.destroy();
    }

    public setVisible(visible: boolean) {
        this.container.visible = visible;
    }

    public isVisible(): boolean {
        return this.container.visible;
    }

    public update(deltaTime: number): void {
    }
}

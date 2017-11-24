/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { BaseState } from "./BaseState";
import { StateManager } from "./StateManager";
import { GameState } from "./GameState";
import { SceneAnimator } from "../sceneanimator/SceneAnimator";
import { introAnimation } from "../IntroAnimation";
import * as Music from "../Music";

export class IntroState extends BaseState {
    animator: SceneAnimator;

    public constructor(manager: StateManager) {
        super(manager);
        this.animator = new SceneAnimator(introAnimation, this.container);
        this.animator.addListener({
            onSceneEnd: () => {
                new GameState(manager);
                this.destroy();
            }
        });
        Music.fadeTo('intro', false);
    }

    public update(deltaTime: number) {
        this.animator.update(deltaTime);
    }
}

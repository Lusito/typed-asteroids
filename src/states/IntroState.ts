import Container from "typedi";

import { BaseState } from "./BaseState";
import { StateManager } from "./StateManager";
import { GameState } from "./GameState";
import { SceneAnimator } from "../sceneanimator/SceneAnimator";
import { introAnimation } from "../sceneAnimations/introAnimation";
import { MusicService } from "../services/MusicService";

export class IntroState extends BaseState {
    animator: SceneAnimator;

    public constructor(manager: StateManager) {
        super(manager);
        this.animator = new SceneAnimator(introAnimation, this.container);
        const music = Container.get(MusicService);
        this.animator.addListener({
            onSceneEnd: () => {
                // eslint-disable-next-line no-new
                new GameState(manager);
                this.destroy();
            },
        });
        music.fadeTo("intro", false);
    }

    public override update(deltaTime: number) {
        this.animator.update(deltaTime);
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { MenuPage } from "./MenuPage";
import { GameEvents } from "../GameEvents";
import { SceneAnimator } from "../sceneanimator/SceneAnimator";
import { creditsAnimation } from "../CreditsAnimation";
import { MenuManager } from "./MenuManager";
import * as Music from "../Music";

export class CreditsMenu extends MenuPage {
    private animator: SceneAnimator;

    public constructor(manager: MenuManager, gameEvents: GameEvents) {
        super(manager);

        this.addItem(500, 'Back', () => {
            this.popPage();
        });
        this.animator = new SceneAnimator(creditsAnimation, this.container);
        this.animator.addListener({ onSceneEnd: () => { this.animator.reset(); } });
    }

    public setVisible(visible: boolean) {
        super.setVisible(visible);
        if (visible) {
            Music.fadeTo('outro');
            this.animator.reset();
        } else {
            Music.fadeTo('ambience');
        }
    }

    public update(deltaTime: number) {
        this.animator.update(deltaTime);
    }
}

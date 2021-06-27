import { Service } from "typedi";

import { MenuPage } from "./MenuPage";
import { SceneAnimator } from "../sceneanimator/SceneAnimator";
import { creditsAnimation } from "../sceneAnimations/creditsAnimation";
import { MenuManager } from "./MenuManager";
import { AssetLoader } from "../services/AssetLoader";
import { MusicService } from "../services/MusicService";

@Service()
export class CreditsMenu extends MenuPage {
    private animator: SceneAnimator;

    private readonly music: MusicService;

    public constructor(assets: AssetLoader, manager: MenuManager, music: MusicService) {
        super(assets, manager);
        this.music = music;

        this.addItem(500, "Back", () => {
            this.popPage();
        });
        this.animator = new SceneAnimator(creditsAnimation, this.container);
        this.animator.addListener({
            onSceneEnd: () => {
                this.animator.reset();
            },
        });
    }

    public override setVisible(visible: boolean) {
        super.setVisible(visible);
        if (visible) {
            this.music.fadeTo("outro");
            this.animator.reset();
        } else {
            this.music.fadeTo("ambience");
        }
    }

    public override update(deltaTime: number) {
        this.animator.update(deltaTime);
    }
}

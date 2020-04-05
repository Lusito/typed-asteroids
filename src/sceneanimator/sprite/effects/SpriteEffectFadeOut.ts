import type { SpriteItem } from "../SpriteItem";
import { SpriteAnimation } from "../../SceneAnimatorJSON";
import { SpriteEffect } from "./SpriteEffect";

export class SpriteEffectFadeOut extends SpriteEffect {
    public prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.alpha = 0;
    }

    public update(item: SpriteItem) {
        item.container.alpha = 1 - item.animationTime / item.totalAnimationTime;
        if (item.container.alpha <= 0) {
            item.container.alpha = 0;
            item.container.visible = false;
            item.effect = null;
        }
    }
}

import type { SpriteItem } from "../SpriteItem";
import { SpriteAnimation } from "../../SceneAnimatorJSON";
import { SpriteEffect } from "./SpriteEffect";

export class SpriteEffectFadeIn extends SpriteEffect {
    public override prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.alpha = 0;
        item.container.visible = true;
    }

    public override update(item: SpriteItem) {
        item.container.alpha = item.animationTime / item.totalAnimationTime;
        if (item.container.alpha >= 1) {
            item.container.alpha = 1;
            item.effect = null;
        }
    }
}

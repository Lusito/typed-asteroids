import type { SpriteItem } from "../SpriteItem";
import { SpriteAnimation } from "../../SceneAnimatorJSON";
import { SpriteEffect } from "./SpriteEffect";

export class SpriteEffectScaleIn extends SpriteEffect {
    public override prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.scale.set(0);
        item.container.visible = true;
    }

    public override update(item: SpriteItem) {
        const scale = item.animationTime / item.totalAnimationTime;
        item.container.scale.set(scale * item.scale);
        if (scale >= 1) {
            item.container.scale.set(item.scale);
            item.effect = null;
        }
    }
}

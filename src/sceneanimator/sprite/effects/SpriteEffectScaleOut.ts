import type { SpriteItem } from "../SpriteItem";
import { SpriteAnimation } from "../../SceneAnimatorJSON";
import { SpriteEffect } from "./SpriteEffect";

export class SpriteEffectScaleOut extends SpriteEffect {
    public prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.scale.set(0);
    }

    public update(item: SpriteItem) {
        const scale = 1 - item.animationTime / item.totalAnimationTime;
        item.container.scale.set(scale * item.scale);
        if (scale <= 0) {
            item.container.scale.set(0);
            item.container.visible = false;
            item.effect = null;
        }
    }
}

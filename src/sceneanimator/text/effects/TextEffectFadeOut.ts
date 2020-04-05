import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";
import { TextEffect } from "./TextEffect";

export class TextEffectFadeOut extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
    }

    public update(item: TextItem) {
        item.container.alpha = 1 - item.animationTime / item.totalAnimationTime;
        if (item.container.alpha <= 0) {
            item.container.alpha = 0;
            item.effect = null;
        }
    }
}

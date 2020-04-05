/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";
import { TextEffect } from "./TextEffect";

export class TextEffectFadeIn extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.container.alpha = 0;
    }

    public update(item: TextItem) {
        item.container.alpha = item.animationTime / item.totalAnimationTime;
        if (item.container.alpha >= 1) {
            item.container.alpha = 1;
            item.effect = null;
        }
    }
}

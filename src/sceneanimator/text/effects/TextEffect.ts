/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";

export abstract class TextEffect {
    prepare(item: TextItem, animation: TextAnimation) {
        item.animationTime = 0;
        item.totalAnimationTime = Math.max(0, animation.effectTime ?? 0);
        item.container.alpha = 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update(_item: TextItem, _deltaTime: number) {}
}

import type { SpriteItem } from "../SpriteItem";
import { SpriteAnimation } from "../../SceneAnimatorJSON";

export abstract class SpriteEffect {
    prepare(item: SpriteItem, animation: SpriteAnimation) {
        item.animationTime = 0;
        item.totalAnimationTime = Math.max(0, animation.effectTime ?? 0);
        item.container.alpha = 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update(_item: SpriteItem, _deltaTime: number) {}
}

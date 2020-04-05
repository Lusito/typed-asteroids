/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import type { SpriteItem } from "./SpriteItem";
import { SpriteAnimation } from "../SceneAnimatorJSON";

export abstract class SpriteEffect {
    prepare(item: SpriteItem, animation: SpriteAnimation) {
        item.animationTime = 0;
        item.totalAnimationTime = Math.max(0, animation.effectTime ?? 0);
        item.container.alpha = 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update(_item: SpriteItem, _deltaTime: number) {}
}

export class SpriteEffectFadeIn extends SpriteEffect {
    public prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.alpha = 0;
        item.container.visible = true;
    }

    public update(item: SpriteItem) {
        item.container.alpha = item.animationTime / item.totalAnimationTime;
        if (item.container.alpha >= 1) {
            item.container.alpha = 1;
            item.effect = null;
        }
    }
}

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

export class SpriteEffectScaleIn extends SpriteEffect {
    public prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.scale.set(0);
        item.container.visible = true;
    }

    public update(item: SpriteItem) {
        const scale = item.animationTime / item.totalAnimationTime;
        item.container.scale.set(scale * item.scale);
        if (scale >= 1) {
            item.container.scale.set(item.scale);
            item.effect = null;
        }
    }
}

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

export class SpriteEffectHide extends SpriteEffect {
    public prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.visible = false;
    }
}

export class SpriteEffectShow extends SpriteEffect {
    public prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.visible = true;
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import type { TextItem } from "./TextItem";
import type { TextAnimation } from "../SceneAnimatorJSON";
import { TextChar } from "./TextChar";

export abstract class TextEffect {
    prepare(item: TextItem, animation: TextAnimation) {
        item.animationTime = 0;
        item.totalAnimationTime = Math.max(0, animation.effectTime ?? 0);
        item.container.alpha = 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update(_item: TextItem, _deltaTime: number) {}
}

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

export class TextEffectConstruct extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.chars = [];
        const constructType = animation.effect === "construct_type";
        for (let i = 0; i < item.originalText.length; i++) {
            const startTime = constructType ? i * item.totalAnimationTime * 0.5 : 0;
            // Fixme: ignore whitespaces
            item.chars.push(new TextChar(item.style, item.container, item.originalText, i, animation, startTime));
        }

        item.text.text = "";
    }

    public update(item: TextItem, deltaTime: number) {
        for (let i = item.chars.length - 1; i >= 0; i--) {
            const tc = item.chars[i];
            if (tc.update(deltaTime, item.totalAnimationTime)) {
                item.text.text = item.originalText.substring(0, item.text.text.length + 1);
                item.chars[i].destroy();
                item.chars.splice(i, 1);
            }
        }
    }
}

export class TextEffectType extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.text.text = "";
    }

    public update(item: TextItem) {
        const numChars = Math.floor(item.animationTime / item.totalAnimationTime);
        if (numChars < item.originalText.length) {
            item.text.text = item.originalText.substring(0, numChars);
        } else {
            item.text.text = item.originalText;
            item.effect = null;
        }
    }
}

export class TextEffectTypeInstant extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.text.text = item.originalText;
        item.effect = null;
    }
}

export class TextEffectUntype extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.text.text = item.originalText;
    }

    public update(item: TextItem) {
        const numChars = item.originalText.length - Math.floor(item.animationTime / item.totalAnimationTime);
        if (numChars > 0) {
            item.text.text = item.originalText.substring(0, numChars);
        } else {
            item.text.text = "";
            item.effect = null;
        }
    }
}

export class TextEffectUntypeInstant extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.text.text = "";
        item.effect = null;
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { TextItem } from "./TextItem";
import { TextAnimation } from "../SceneAnimatorJson";
import { TextChar } from "./TextChar";

export abstract class TextEffect {
    prepare(item: TextItem, animation: TextAnimation): void {
        item.animationTime = 0;
        item.totalAnimationTime = Math.max(0, (animation.effectTime || 0));
        item.container.alpha = 1;
    }
    abstract update(item: TextItem, deltaTime: number): void;
}

export class TextEffectFadeIn extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation): void {
        super.prepare(item, animation);
        item.container.alpha = 0;
    }
    public update(item: TextItem, deltaTime: number): void {
        item.container.alpha = item.animationTime / item.totalAnimationTime;
        if (item.container.alpha >= 1) {
            item.container.alpha = 1;
            item.effect = null;
        }
    }
}

export class TextEffectFadeOut extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation): void {
        super.prepare(item, animation);
    }
    public update(item: TextItem, deltaTime: number): void {
        item.container.alpha = 1 - (item.animationTime / item.totalAnimationTime);
        if (item.container.alpha <= 0) {
            item.container.alpha = 0;
            item.effect = null;
        }
    }
}

export class TextEffectConstruct extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation): void {
        super.prepare(item, animation);
        item.chars = [];
        let constructType = animation.effect === 'construct_type';
        for (let i = 0; i < item.originalText.length; i++) {
            let startTime = constructType ? (i * item.totalAnimationTime * 0.5) : 0;
            //Fixme: ignore whitespaces
            item.chars.push(new TextChar(item.style, item.container, item.originalText, i, animation, startTime, item.totalAnimationTime));
        }

        item.text.text = "";
    }
    public update(item: TextItem, deltaTime: number): void {
        for (let i = item.chars.length - 1; i >= 0; i--) {
            let tc = item.chars[i];
            if (tc.update(deltaTime, item.totalAnimationTime)) {
                item.text.text = item.originalText.substring(0, item.text.text.length + 1);
                item.chars[i].destroy();
                item.chars.splice(i, 1);
            }
        }
    }
}

export class TextEffectType extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation): void {
        super.prepare(item, animation);
        item.text.text = "";
    }
    public update(item: TextItem, deltaTime: number): void {
        let numChars = Math.floor(item.animationTime / item.totalAnimationTime);
        if (numChars < item.originalText.length) {
            item.text.text = item.originalText.substring(0, numChars);
        } else {
            item.text.text = item.originalText;
            item.effect = null;
        }
    }
}

export class TextEffectTypeInstant extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation): void {
        super.prepare(item, animation);
        item.text.text = item.originalText;
        item.effect = null;
    }
    public update(item: TextItem, deltaTime: number): void {
    }
}

export class TextEffectUntype extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation): void {
        super.prepare(item, animation);
        item.text.text = item.originalText;
    }
    public update(item: TextItem, deltaTime: number): void {
        let numChars = item.originalText.length - Math.floor(item.animationTime / item.totalAnimationTime);
        if (numChars > 0) {
            item.text.text = item.originalText.substring(0, numChars);
        } else {
            item.text.text = "";
            item.effect = null;
        }
    }
}

export class TextEffectUntypeInstant extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation): void {
        super.prepare(item, animation);
        item.text.text = "";
        item.effect = null;
    }
    public update(item: TextItem, deltaTime: number): void {
    }
}

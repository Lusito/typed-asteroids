import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";
import { TextChar } from "../TextChar";
import { TextEffect } from "./TextEffect";

export class TextEffectConstruct extends TextEffect {
    public override prepare(item: TextItem, animation: TextAnimation) {
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

    public override update(item: TextItem, deltaTime: number) {
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

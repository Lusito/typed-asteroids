import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";
import { TextEffect } from "./TextEffect";

export class TextEffectType extends TextEffect {
    public override prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.text.text = "";
    }

    public override update(item: TextItem) {
        const numChars = Math.floor(item.animationTime / item.totalAnimationTime);
        if (numChars < item.originalText.length) {
            item.text.text = item.originalText.substring(0, numChars);
        } else {
            item.text.text = item.originalText;
            item.effect = null;
        }
    }
}

import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";
import { TextEffect } from "./TextEffect";

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

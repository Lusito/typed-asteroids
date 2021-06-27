import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";
import { TextEffect } from "./TextEffect";

export class TextEffectTypeInstant extends TextEffect {
    public override prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.text.text = item.originalText;
        item.effect = null;
    }
}

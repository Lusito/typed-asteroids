import type { TextItem } from "../TextItem";
import type { TextAnimation } from "../../SceneAnimatorJSON";
import { TextEffect } from "./TextEffect";

export class TextEffectUntypeInstant extends TextEffect {
    public prepare(item: TextItem, animation: TextAnimation) {
        super.prepare(item, animation);
        item.text.text = "";
        item.effect = null;
    }
}

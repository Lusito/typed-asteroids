/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import type { SpriteItem } from "../SpriteItem";
import { SpriteAnimation } from "../../SceneAnimatorJSON";
import { SpriteEffect } from "./SpriteEffect";

export class SpriteEffectShow extends SpriteEffect {
    public prepare(item: SpriteItem, animation: SpriteAnimation) {
        super.prepare(item, animation);
        item.container.visible = true;
    }
}

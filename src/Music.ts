/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import pixiSound from "pixi-sound";

import { getSound } from "./loader";

let currentSound: pixiSound.Sound | null = null;
let currentSoundInstance: pixiSound.IMediaInstance | null = null;

export function fadeTo(name: "ambience" | "intro" | "outro", loop = true) {
    const sound = getSound(name);
    if (currentSound === sound) return;

    if (currentSoundInstance) {
        currentSoundInstance.stop();
        currentSoundInstance = null;
    }
    if (sound) currentSoundInstance = sound.play({ loop }) as pixiSound.IMediaInstance;
    currentSound = sound;
}

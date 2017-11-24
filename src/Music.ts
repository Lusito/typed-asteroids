/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import Sound from "pixi-sound/lib/Sound";
import SoundInstance from "pixi-sound/lib/SoundInstance";

const sounds: { [s: string]: Sound | null } = {
    ambience: null,
    intro: null,
    outro: null
};
let currentSound: Sound | null = null;
let currentSoundInstance: SoundInstance | null = null;

export function initResources() {
    for (let key in sounds) {
        sounds[key] = (PIXI.loader.resources[key] as any).sound;
    }
}

export function fadeTo(name: "ambience" | "intro" | "outro", loop: boolean = true) {
    const sound = sounds[name] || null;
    if (currentSound === sound)
        return;

    let fadeIn;
    if (currentSoundInstance) {
        //Fixme: actually fade out
        // fadeIn = 1;
        currentSoundInstance.stop();
        currentSoundInstance = null;
    }
    if (sound)
        currentSoundInstance = <SoundInstance>sound.play({ loop: loop, fadeIn: fadeIn });
    currentSound = sound;
}

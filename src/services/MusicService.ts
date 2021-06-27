import pixiSound from "pixi-sound";
import { Inject, Service } from "typedi";

import { AssetLoader } from "./AssetLoader";

@Service({ global: true })
export class MusicService {
    @Inject()
    private readonly assets!: AssetLoader;

    private currentSound: pixiSound.Sound | null = null;

    private currentSoundInstance: pixiSound.IMediaInstance | null = null;

    public fadeTo(name: "ambience" | "intro" | "outro", loop = true) {
        const sound = this.assets.getSound(name);
        if (this.currentSound === sound) return;

        if (this.currentSoundInstance) {
            this.currentSoundInstance.stop();
            this.currentSoundInstance = null;
        }
        if (sound) this.currentSoundInstance = sound.play({ loop }) as pixiSound.IMediaInstance;
        this.currentSound = sound;
    }
}

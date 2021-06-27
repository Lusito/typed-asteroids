import { Application, Loader, Sprite } from "pixi.js";
import Container, { Service } from "typedi";

@Service({ global: true })
export class AssetLoader {
    private readonly loader: Loader;

    public constructor() {
        this.loader = Container.get(Application).loader;
    }

    public getTexture(name: string) {
        return this.loader.resources[name]?.texture;
    }

    public createSprite(name: string) {
        return new Sprite(this.getTexture(name));
    }

    public getSound(name: string) {
        return this.loader.resources[name]?.sound;
    }

    public getProgress() {
        return this.loader.progress;
    }

    public addOnProgress(listener: () => void) {
        const handle = this.loader.onProgress.add(listener);
        return () => this.loader.onProgress.detach(handle);
    }

    public addOnCompleteOnce(listener: () => void) {
        return this.loader.onComplete.once(listener);
    }

    public preload(name: string, url: string) {
        this.loader.add(name, url);
    }

    public startLoading() {
        return this.loader.load();
    }
}

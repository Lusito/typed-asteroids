import { Loader } from "pixi.js";

let loader: Loader;

export function setLoader(loaderInstance: Loader) {
    loader = loaderInstance;
(window as any).loader = loader;
}

export function getTexture(name: string) {
    return loader.resources[name]?.texture;
}

export function getSound(name: string) {
    return loader.resources[name]?.sound;
}

export function getProgress() {
    return loader.progress;
}

export function addOnProgress(listener: () => void) {
    const handle = loader.onProgress.add(listener);
    return () => loader.onProgress.detach(handle);
}

export function addOnCompleteOnce(listener: () => void) {
    return loader.onComplete.once(listener);
}

export function preload(name: string, url: string) {
    loader.add(name, url);
}

export function startLoading() {
    return loader.load();
}

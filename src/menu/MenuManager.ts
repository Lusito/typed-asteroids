/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { MenuPage } from "./MenuPage";
import { Signal } from "typed-signals";
import { Container } from "pixi.js";

export class MenuManager {
    public readonly container: Container;
    private currentPage: MenuPage | null = null;
    private readonly allPages: MenuPage[] = [];
    private readonly pageStack: MenuPage[] = [];
    public readonly emptyPop = new Signal<() => void>();

    public constructor(stage: Container) {
        this.container = new Container();
        stage.addChild(this.container);
    }

    public register(page: MenuPage): void {
        this.allPages.push(page);
    }

    public update(deltaTime: number): void {
        if (this.currentPage)
            this.currentPage.update(deltaTime);
    }

    public isVisible(): boolean {
        return this.currentPage !== null;
    }

    public destroy(): void {
        for (let page of this.allPages)
            page.destroy();
        this.container.destroy();
    }

    public pushPage(page: MenuPage): void {
        if (this.currentPage != null) {
            this.currentPage.setVisible(false);
            this.pageStack.push(this.currentPage);
        }
        this.currentPage = page;
        this.currentPage.setVisible(true);
    }

    public popPage(): void {
        if (this.currentPage)
            this.currentPage.setVisible(false);

        let page = this.pageStack.pop();
        if (!page) {
            this.currentPage = null;
            this.emptyPop.emit();
        } else {
            this.currentPage = page;
            page.setVisible(true);
        }
    }

    public popAllPages(): void {
        while (this.currentPage)
            this.popPage();
    }

    public onKeyDown(e: KeyboardEvent) {
        if (this.currentPage)
            this.currentPage.onKeyDown(e);
    }

    public onKeyUp(e: KeyboardEvent) {
        if (this.currentPage)
            this.currentPage.onKeyUp(e);
    }
}

import { Signal } from "typed-signals";
import { Container } from "pixi.js";
import { Service } from "typedi";

import type { MenuPage } from "./MenuPage";

@Service()
export class MenuManager {
    public readonly container = new Container();

    private currentPage: MenuPage | null = null;

    private readonly allPages: MenuPage[] = [];

    private readonly pageStack: MenuPage[] = [];

    public readonly emptyPop = new Signal<() => void>();

    public register(page: MenuPage) {
        this.allPages.push(page);
    }

    public update(deltaTime: number) {
        if (this.currentPage) this.currentPage.update(deltaTime);
    }

    public isVisible() {
        return this.currentPage !== null;
    }

    public destroy() {
        for (const page of this.allPages) page.destroy();
        this.container.destroy();
    }

    public pushPage(page: MenuPage) {
        if (this.currentPage != null) {
            this.currentPage.setVisible(false);
            this.pageStack.push(this.currentPage);
        }
        this.currentPage = page;
        this.currentPage.setVisible(true);
    }

    public popPage() {
        if (this.currentPage) this.currentPage.setVisible(false);

        const page = this.pageStack.pop();
        if (!page) {
            this.currentPage = null;
            this.emptyPop.emit();
        } else {
            this.currentPage = page;
            page.setVisible(true);
        }
    }

    public popAllPages() {
        while (this.currentPage) this.popPage();
    }

    public onKeyDown(e: KeyboardEvent) {
        if (this.currentPage) this.currentPage.onKeyDown(e);
    }

    public onKeyUp(e: KeyboardEvent) {
        if (this.currentPage) this.currentPage.onKeyUp(e);
    }
}

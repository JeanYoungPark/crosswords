// src/scenes/GameScene.ts
import { Container } from "pixi.js";
import { TopBar } from "../components/TopBar";

export class GameScene extends Container {
    constructor() {
        super();

        this.createTopBar();
    }

    private createTopBar() {
        const topbar = new TopBar({ scene: "study" });
        this.addChild(topbar);
    }
}

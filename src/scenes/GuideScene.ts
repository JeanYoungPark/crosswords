import { Container } from "pixi.js";
import { TopBar } from "../components/TopBar";
// import { IMAGE_ASSETS } from "../config";

export class GuideScene extends Container {
    constructor() {
        super();

        this.createTopBar();
        this.createBody();
    }

    private createTopBar() {
        const topbar = new TopBar({ scene: "guide" });
        this.addChild(topbar);
    }

    private createBody() {
        this.createBackground();
    }

    private createBackground() {
        // const bg = new Sprite(IMAGE_ASSETS.guide);
    }
}

import { Container, Sprite } from "pixi.js";
import { TopBar } from "../components/TopBar";
import { sceneManager } from "../main";
import { IntroScene } from "./IntroScene";
import { ASSETS, deviceType, HEIGHT, WIDTH } from "../config";

export class GuideScene extends Container {
    private onBackToIntro: () => void;

    constructor() {
        super();

        this.onBackToIntro = () => sceneManager.switchScene(new IntroScene());

        this.createTopBar();
        this.createBody();
    }

    private createTopBar() {
        const topbar = new TopBar();

        topbar.backBtn(this.onBackToIntro);
        topbar.soundBtn({ x: 160 });
        topbar.closeBtn();
        this.addChild(topbar);
    }

    private createBody() {
        this.createBackground();
        this.createContent();
    }

    private createBackground() {
        const bg = new Sprite(ASSETS.guide[`bg${deviceType === "tablet" ? "Horizontal" : "Vertical"}`]);
        bg.anchor.set(0.5);
        bg.x = WIDTH / 2;
        bg.y = HEIGHT - bg.height / 2;
        this.addChild(bg);
    }

    private createContent() {
        const cont = new Sprite(ASSETS.guide[`kr${deviceType === "tablet" ? "Horizontal" : "Vertical"}`]);
        cont.anchor.set(0.5);
        cont.x = WIDTH / 2;
        cont.y = HEIGHT / 2;
        this.addChild(cont);
    }
}

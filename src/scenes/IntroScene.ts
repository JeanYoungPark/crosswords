import { Container, Sprite, Text } from "pixi.js";
import { gsap } from "gsap";
import { deviceType, gameType, HEIGHT, IMAGE_ASSETS, SoundTextState, WIDTH } from "../config";
import { getContentInfo } from "../apis/get";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";

export class IntroScene extends Container {
    private onStudyStart: () => void;
    private onShowGuide: () => void;
    private info: any;

    constructor({ onStudyStart, onShowGuide }: { onStudyStart: () => void; onShowGuide: () => void }) {
        super();
        this.onStudyStart = onStudyStart;
        this.onShowGuide = onShowGuide;

        this.getData(() => this.createUI());
    }

    private async getData(callback: () => void) {
        const res = await getContentInfo();

        if (res?.code === 200) {
            const text = res.info.sound_text;
            SoundTextState.update(text);

            this.info = res.info;
            callback();
        }
    }

    private async createUI() {
        this.createTopBar();
        this.createBody();
        this.createGuideBtn();
    }

    private createTopBar() {
        const topbar = new TopBar({ scene: "intro" });
        this.addChild(topbar);
    }

    private createBody() {
        this.createBackground();
        this.createTitle();
        this.createContentInfo();
        this.createGameStartBtn();
    }

    private createBackground() {
        const block = new Sprite(IMAGE_ASSETS.loading.bgBlock);
        block.anchor.set(0.5);
        block.x = WIDTH / 2;
        block.y = HEIGHT / 2 - 100;

        this.addChild(block);
    }

    private createTitle() {
        const title = new Sprite(IMAGE_ASSETS.intro.title);
        title.anchor.set(0.5);
        title.x = WIDTH / 2;
        title.y = HEIGHT / 2 - 100;
        title.scale = deviceType === "tablet" ? 1 : 0.7;

        const tl = gsap.timeline({ repeat: -1 });
        tl.to(title, { rotation: 0.05, duration: 2, ease: "linear" });
        tl.to(title, { rotation: 0, duration: 2, ease: "linear" });
        tl.to(title, { rotation: -0.05, duration: 2, ease: "linear" });
        tl.to(title, { rotation: 0, duration: 2, ease: "linear" });

        this.addChild(title);
    }

    private createContentInfo() {
        const contNameContainer = new Container();
        contNameContainer.x = WIDTH / 2;
        contNameContainer.y = HEIGHT / 2 + 150;

        this.createContentName(contNameContainer);

        if (gameType === "word_master") {
            this.createWordMasterStage(contNameContainer);
        } else {
            this.createSubContentInfo(contNameContainer);
        }

        this.addChild(contNameContainer);
    }

    private createContentName(container: Container) {
        const name = new Text({
            text: this.info.cont_name,
            style: {
                fontSize: 46,
                fontWeight: "bold",
            },
        });
        name.anchor.set(0.5);

        container.addChild(name);
    }

    private createWordMasterStage(container: Container) {
        const stage = new Text({
            text: `STAGE ${this.info.stage}`,
            style: {
                fontSize: 46,
            },
        });
        stage.anchor.set(0.5);
        stage.y = 70;

        container.addChild(stage);
    }

    private createSubContentInfo(container: Container) {
        if (this.info.mid_name) {
            const midName = new Text({
                text: this.info.mid_name,
                style: {
                    fontSize: 46,
                    fontWeight: "bold",
                },
            });
            midName.anchor.set(0.5);
            midName.y = 70;
            container.addChild(midName);
        }

        const subName = new Text({
            text: this.info.cont_sub_name,
            style: {
                fontSize: 46,
            },
        });
        subName.anchor.set(0.5);
        subName.y = this.info.mid_name ? 140 : 70;

        container.addChild(subName);
    }

    private createGameStartBtn() {
        const type = deviceType === "tablet" ? "Horizontal" : "Vertical";

        if (gameType === "word_master") {
            const x = deviceType === "tablet" ? 230 : 0;
            const y = deviceType === "tablet" ? 400 : 500;

            const clickFn = () => this.onStudyStart();

            const round1 = new Button(`round1${type}`, WIDTH / 2 - x, HEIGHT / 2 + y);
            const round2 = new Button(`round2${type}`, WIDTH / 2 + x, HEIGHT / 2 + y + 150);

            round1.onpointerup = clickFn;
            round2.onpointerup = clickFn;

            this.addChild(round1);
            this.addChild(round2);
        } else {
            const y = deviceType === "tablet" ? 400 : 650;
            const start = new Button(`start${type}`, WIDTH / 2, HEIGHT / 2 + y);

            const clickFn = () => this.onStudyStart();
            start.onpointerup = clickFn;
            this.addChild(start);
        }
    }

    private createGuideBtn() {
        if (gameType !== "word_master") {
            const guide = new Button("guide", 60, HEIGHT - 60);

            const clickFn = () => this.onShowGuide();
            guide.onpointerup = clickFn;
            this.addChild(guide);
        }
    }
}

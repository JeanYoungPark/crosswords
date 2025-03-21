import { Container, Graphics, Sprite, Text } from "pixi.js";
import { IMAGE_ASSETS, SoundState, SoundTextState, WIDTH } from "../config";
import { Button } from "./Button";

type SceneType = "study" | "game" | "intro" | "guide";

export class TopBar extends Container {
    constructor({ scene }: { scene: SceneType }) {
        super();

        this.background();
        this.buttons(scene);
    }

    private background() {
        const topBar = new Graphics();
        topBar.rect(0, 0, WIDTH, 120);
        topBar.fill(0x1163a6);
        this.addChild(topBar);
    }

    private buttons(scene: SceneType) {
        if (scene === "intro") {
            this.soundBtn({ x: 60 });
            this.closeBtn();
        } else if (scene === "guide") {
            this.backBtn();
            this.soundBtn({ x: 160 });
            this.closeBtn();
        } else if (scene === "study") {
            this.soundBtn({ x: 60 });
            this.closeBtn();
        } else if (scene === "game") {
        }
    }

    private closeBtn() {
        const close = new Button("close", WIDTH - 60, 60);
        this.addChild(close);
    }

    private backBtn() {
        const back = new Button("back", 60, 60);
        this.addChild(back);
    }

    private soundBtn({ x }: { x: number }) {
        const textContainer = new Container();
        textContainer.x = x - 40;
        textContainer.y = 110;

        this.soundIcon({ container: textContainer, x });
        this.soundText({ container: textContainer });

        textContainer.visible = SoundState.value ? false : true;
        this.addChild(textContainer);
    }

    private soundIcon({ container, x }: { container: Container; x: number }) {
        const soundTexture = SoundState.value ? "soundOn" : "soundOff";
        const sound = new Button(soundTexture, x, 60);

        const clickFn = () => {
            const newState = !SoundState.value;
            SoundState.set(newState);

            const newTexture = newState ? "soundOn" : "soundOff";
            sound.texture = IMAGE_ASSETS.buttons[newTexture];

            container.visible = newState ? false : true;
        };
        sound.onpointerup = clickFn;
        this.addChild(sound);
    }

    private soundText({ container }: { container: Container }) {
        const textBg = new Sprite(IMAGE_ASSETS.intro.textBg);

        const text = new Text({
            text: SoundTextState.value,
            style: {
                fontSize: 39,
                fill: 0xffffff,
            },
        });
        text.x = 40;
        text.y = 55;

        container.addChild(textBg);
        container.addChild(text);
    }
}

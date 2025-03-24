import { Container, Graphics, Sprite, Text } from "pixi.js";
import { ASSETS, SoundState, SoundTextState, WIDTH } from "../config";
import { Button } from "./Button";

export class TopBar extends Container {
    constructor() {
        super();
        this.background();
    }

    private background() {
        const topBar = new Graphics();
        topBar.rect(0, 0, WIDTH, 120);
        topBar.fill(0x1163a6);
        this.addChild(topBar);
    }

    public closeBtn() {
        const close = new Button("close", WIDTH - 60, 60);
        this.addChild(close);
    }

    public backBtn(callbackFn?: () => void) {
        const back = new Button("back", 60, 60);
        back.onpointerup = callbackFn;
        this.addChild(back);
    }

    public soundBtn({ x }: { x: number }) {
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
            sound.texture = ASSETS.buttons[newTexture];

            container.visible = newState ? false : true;
        };
        sound.onpointerup = clickFn;
        this.addChild(sound);
    }

    private soundText({ container }: { container: Container }) {
        const textBg = new Sprite(ASSETS.intro.textBg);

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

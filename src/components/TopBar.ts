import { Container, Graphics, Sprite, Text } from "pixi.js";
import { ASSETS, soundState, soundTextState, WIDTH } from "../config";
import { Button } from "./Button";
import { sound } from "@pixi/sound";

export class TopBar extends Container {
    constructor() {
        super();
        this.background();
    }

    private background() {
        const topBar = new Graphics();
        topBar.rect(0, 0, WIDTH, 130);
        topBar.fill(0x1163a6);
        this.addChild(topBar);
    }

    closeBtn() {
        const close = new Button("close", WIDTH - 65, 65);
        this.addChild(close);
    }

    backBtn(callbackFn?: () => void) {
        const back = new Button("back", 65, 65);
        back.onpointerdown = () => {
            sound.play("backBtn");
        };
        back.onpointerup = callbackFn;
        this.addChild(back);
    }

    refreshBtn({ x, callback }: { x: number; callback?: () => void }) {
        const refresh = new Button("refresh", x, 65);
        refresh.onpointerup = callback;
        this.addChild(refresh);
    }

    soundBtn({ x }: { x: number }) {
        const textContainer = new Container();
        textContainer.x = x - 40;
        textContainer.y = 110;

        this.soundIcon({ container: textContainer, x });
        this.soundText({ container: textContainer });

        textContainer.visible = soundState.value ? false : true;
        this.addChild(textContainer);
    }

    private soundIcon({ container, x }: { container: Container; x: number }) {
        const soundTexture = soundState.value ? "soundOn" : "soundOff";
        const soundIcon = new Button(soundTexture, x, 65);

        const clickFn = () => {
            const newState = !soundState.value;
            soundState.set(newState);

            const newTexture = newState ? "soundOn" : "soundOff";
            soundIcon.texture = ASSETS.buttons[newTexture];

            container.visible = newState ? false : true;

            newState ? sound.unmuteAll() : sound.muteAll();
        };

        soundIcon.onpointerup = clickFn;
        this.addChild(soundIcon);
    }

    private soundText({ container }: { container: Container }) {
        const textBg = new Sprite(ASSETS.intro.textBg);

        const text = new Text({
            text: soundTextState.value,
            style: {
                fontSize: 39,
                fill: 0xffffff,
            },
        });
        text.x = 40;
        text.y = 60;

        container.addChild(textBg);
        container.addChild(text);
    }
}

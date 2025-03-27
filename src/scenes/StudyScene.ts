import { Container, Graphics, Sprite, Text } from "pixi.js";
import { TopBar } from "../components/TopBar";
import { ASSETS, deviceType, HEIGHT, littlefoxCookies, studyAnswerState, WIDTH } from "../config";
import Typing from "../utils/typing";
import { Button } from "../components/Button";
import { Keyboard } from "../components/Keyboard";
import { sceneManager } from "../main";
import { GameScene } from "./GameScene";

export class StudyScene extends Container {
    private inputIndex: number = 0;
    private answer: string = "";
    private inputTextArray: Text[] = [];
    private inputFocusArray: Sprite[] = [];

    private light: Sprite = new Sprite();
    private lightOnBg: Sprite = new Sprite();
    private lightOffBg: Sprite = new Sprite();
    private lightText: Text = new Text();

    private text: Text = new Text();
    private inputContainer: Container = new Container();

    private infoContainer: Container = new Container();

    constructor() {
        super();

        Typing.getWord();

        this.createTopBar();
        this.createBody();
        this.createInfo();
    }

    private createTopBar() {
        const topbar = new TopBar();
        topbar.soundBtn({ x: 60 });
        topbar.closeBtn();
        this.addChild(topbar);
    }

    private createBody() {
        this.createTextBox();
        this.createLight();
        this.createInput();
        this.createButton();
        this.createKeyboard();
    }

    private createTextBox() {
        const w = WIDTH - 60;

        const container = new Container();
        container.x = 30;
        container.y = 300;

        const bg = new Graphics();
        bg.filletRect(0, 0, w, deviceType === "tablet" ? 180 : 250, 20);
        bg.fill(0xffffff);
        bg.stroke({ width: 3, color: 0x597fab, alpha: 1 });
        container.addChild(bg);

        const data = Typing.clue;
        const txt = new Text({
            text: data?.word_view ? data.word_view : "",
            style: {
                fontSize: 55,
            },
        });

        txt.anchor.set(0.5);
        txt.x = w / 2;
        txt.y = bg.height / 2;
        container.addChild(txt);
        this.text = txt;

        this.addChild(container);
    }

    private createLight() {
        const lightOnBg = new Sprite(ASSETS.study.lightOnBg);
        lightOnBg.anchor.set(0.5);
        lightOnBg.x = WIDTH / 2;
        lightOnBg.y = deviceType === "tablet" ? 635 : 855;
        lightOnBg.visible = false;
        this.addChild(lightOnBg);

        const lightOffBg = new Sprite(ASSETS.study.lightOffBg);
        lightOffBg.anchor.set(0.5);
        lightOffBg.x = WIDTH / 2;
        lightOffBg.y = deviceType === "tablet" ? 635 : 855;
        lightOffBg.visible = false;
        this.addChild(lightOffBg);

        const light = new Sprite(ASSETS.study.lightOff);
        light.anchor.set(0.5);
        light.x = WIDTH / 2;
        light.y = deviceType === "tablet" ? 635 : 855;
        this.addChild(light);

        this.lightOnBg = lightOnBg;
        this.lightOffBg = lightOffBg;
        this.light = light;

        const text = new Text({
            text: `${Number(studyAnswerState.value / (Typing?.data?.cross_puzzle.clues.length ?? 0)) * 100}%`,
            style: {
                fontSize: 39,
            },
        });
        text.anchor.set(0.5);
        text.x = WIDTH / 2;
        text.y = deviceType === "tablet" ? 603 : 821;

        this.addChild(text);
        this.lightText = text;
    }

    private turnOnLight() {
        this.light.texture = ASSETS.study.lightOn;
        this.lightOnBg.visible = true;

        setTimeout(() => {
            this.light.texture = ASSETS.study.lightOff;
            this.lightOnBg.visible = false;
        }, 1000);
    }

    private turnOffLight() {
        this.light.texture = ASSETS.study.lightOff;
        this.lightOffBg.visible = true;

        setTimeout(() => {
            this.lightOffBg.visible = false;
        }, 500);
    }

    private createInput() {
        if (this.inputContainer) {
            this.removeChild(this.inputContainer);
            this.inputContainer.destroy({ children: true }); // 메모리 해제
        }

        const txt = Typing.clue?.word_view ?? "";
        const inputWidth = deviceType === "tablet" ? 102 : 70;
        const inputFocusWidth = deviceType === "tablet" ? 108 : 78;

        const container = new Container();
        container.x = 50 + (WIDTH - 2 - txt.length * inputWidth) / 2;
        container.y = deviceType === "tablet" ? 859 : 1129;

        for (let index = 0; index < txt.length; index++) {
            const input = new Sprite(ASSETS.study.input);
            input.anchor.set(0.5);
            input.x = index * inputWidth;
            input.width = inputWidth;
            input.height = inputWidth;

            container.addChild(input);

            const inputText = new Text({
                text: "",
                style: {
                    fontSize: 42,
                },
            });
            inputText.anchor.set(0.5);
            inputText.x = index * inputWidth;
            this.inputTextArray.push(inputText);
            container.addChild(inputText);
        }

        for (let index = 0; index < txt.length; index++) {
            const inputFocus = new Sprite(ASSETS.study.inputFocus);
            inputFocus.anchor.set(0.5);
            inputFocus.x = index * inputFocusWidth - index * 5;
            inputFocus.width = inputFocusWidth;
            inputFocus.height = inputFocusWidth;
            inputFocus.visible = false;
            this.inputFocusArray.push(inputFocus);

            container.addChild(inputFocus);
        }

        this.inputFocusArray[0].visible = true;
        this.addChild(container);
        this.inputContainer = container;
    }

    private createKeyboard() {
        const clickFn = (key: string) => {
            this.updateFocus(key);
            this.updateText(key === "delete" ? "" : key);
            this.isCorrect();
        };

        const keyboard = new Keyboard(clickFn);
        this.addChild(keyboard);
    }

    private updateText(letter: string) {
        let newText = "";
        let letterIndex = this.inputIndex + (letter ? -1 : 0);

        this.inputTextArray.forEach((txt, idx) => {
            if (idx === letterIndex) {
                txt.text = letter;
            }
            newText += txt.text as string;
        });

        if (letter) {
            if (newText === Typing.clue?.word_view.substring(0, letterIndex + 1)) {
                this.turnOnLight();
            } else {
                this.turnOffLight();
            }
        }

        this.answer = newText;
    }

    private updateFocus(key: string) {
        // 마지막 input에 text가 있다면 유지
        const nextIndex = this.inputIndex + (key === "delete" ? -1 : 1);

        if (nextIndex < 0) return;
        if (nextIndex > (Typing.clue?.word_view.length || 0) && this.inputTextArray[(Typing.clue?.word_view.length || 0) - 1].text) return;

        this.inputIndex = nextIndex;

        if (nextIndex < (Typing.clue?.word_view.length || 0)) {
            this.inputFocusArray.forEach((focus, idx) => {
                focus.visible = idx === this.inputIndex;
            });
        }
    }

    private isCorrect() {
        if (this.answer === Typing.clue?.word_view) {
            Typing.getWord();
            studyAnswerState.add();
            this.init();
        }
    }

    private createButton() {
        const h = deviceType === "tablet" ? 410 : 460;

        const help = new Button("guide", 65, HEIGHT - h - 60);
        help.onpointerup = () => {
            this.infoContainer.visible = true;
        };
        this.addChild(help);

        const skip = new Button("skip", WIDTH - 163, HEIGHT - h - 60);
        skip.onpointerup = () => {
            sceneManager.switchScene(new GameScene());
        };
        this.addChild(skip);
    }

    private createInfo() {
        const container = new Container();

        const bg = new Graphics();
        bg.rect(0, 0, WIDTH, HEIGHT);
        bg.fill({ color: 0x000, alpha: 80 });

        container.addChild(bg);

        const box = new Graphics();
        const w = deviceType === "tablet" ? 930 : 750;
        const h = deviceType === "tablet" ? 450 : 680;

        box.filletRect(WIDTH / 2 - w / 2, HEIGHT / 2 - h / 2, w, h, 20);
        box.fill(0xffffff);
        box.stroke({ width: 3, color: 0x6fcdf6, alpha: 1 });
        container.addChild(box);

        const lang = littlefoxCookies().lang.charAt(0).toUpperCase() + littlefoxCookies().lang.slice(1);
        const txt = new Sprite(ASSETS.study[`info${lang}${deviceType === "tablet" ? "Horizontal" : "Vertical"}`]);
        txt.x = WIDTH / 2 - w / 2;
        txt.y = HEIGHT / 2 - h / 2;
        container.addChild(txt);

        const close = new Button("close", WIDTH / 2 + w / 2 - 20, HEIGHT / 2 - h / 2 + 20);
        close.onpointerup = () => (container.visible = false);
        container.addChild(close);

        this.addChild(container);
        this.infoContainer = container;
    }

    private init() {
        this.inputIndex = 0;
        this.answer = "";
        this.inputTextArray = [];
        this.inputFocusArray = [];

        this.text.text = Typing.clue?.word_view ?? "";
        this.lightText.text = `${Number(studyAnswerState.value / (Typing?.data?.cross_puzzle.clues.length ?? 0)) * 100}%`;
        this.createInput();
    }
}

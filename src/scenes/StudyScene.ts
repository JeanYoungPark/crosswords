import { Container, Graphics, Sprite, Text } from "pixi.js";
import { TopBar } from "../components/TopBar";
import { ASSETS, deviceType, HEIGHT, studyAnswerState, WIDTH } from "../config";
import Typing from "../utils/typing";
import { Button } from "../components/Button";

export class StudyScene extends Container {
    private inputIndex: number = 0;
    private answer: string = "";
    private inputTextArray: Text[] = [];
    private inputFocusArray: Sprite[] = [];

    constructor() {
        super();

        Typing.getWord();

        this.createTopBar();
        this.createBody();
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

        this.addChild(container);
    }

    private createLight() {
        const light = new Sprite(ASSETS.study.lightOff);
        light.anchor.set(0.5);
        light.x = WIDTH / 2;
        light.y = deviceType === "tablet" ? 635 : 855;
        this.addChild(light);

        const text = new Text({
            text: `${Number(studyAnswerState.value / (Typing?.data?.cross_puzzle.clues.length ?? 0))}%`,
            style: {
                fontSize: 39,
            },
        });
        text.anchor.set(0.5);
        text.x = WIDTH / 2;
        text.y = deviceType === "tablet" ? 603 : 821;

        this.addChild(text);
    }

    private createInput() {
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

        this.addChild(container);

        this.updateFocus(0);
    }

    private createKeyboard() {
        const h = deviceType === "tablet" ? 410 : 460;
        const bg = new Graphics();
        bg.rect(0, 0, WIDTH, h);
        bg.fill(0xa8c6e0);
        bg.y = HEIGHT - h;
        this.addChild(bg);

        const type = deviceType === "tablet" ? "Horizontal" : "Vertical";
        const keyRows = [
            { letters: "qwertyuiop", yOffset: 80, keyCount: 10 },
            { letters: "asdfghjkl", yOffset: 210, keyCount: 9 },
            { letters: "zxcvbnm", yOffset: 340, keyCount: 8 },
        ];

        const clickFn = (e: Sprite, defaultTexture: string, key: string) => {
            e.texture = ASSETS.buttons[defaultTexture];
            this.updateText(key);

            let nextIndex = this.inputIndex + 1;
            if (nextIndex < (Typing.clue?.word_view.length ?? 0)) {
                this.updateFocus(nextIndex);
            }

            this.isCorrect();
        };

        const clickDeleteFn = (e: Sprite, defaultTexture: string) => {
            e.texture = ASSETS.buttons[defaultTexture];
            this.updateText("");

            let nextIndex = this.inputIndex - 1;
            if (this.inputIndex > 0) {
                this.updateFocus(nextIndex);
            }
        };

        // 공통된 함수로 키 생성
        const createKeys = (letters: string, yOffset: number, keyCount: number, startX: number, isLastRow: boolean = false) => {
            [...letters].map((letter, i) => {
                const txt = `${letter}${type}`;
                const key = new Button(txt, startX + i * 132, HEIGHT - h + yOffset);
                key.onpointerup = () => clickFn(key, txt, letter);
                this.addChild(key);
            });

            // 마지막 줄에만 delete 키 추가
            if (isLastRow) {
                const deleteTxt = `delete${type}`;
                const deleteKey = new Button(deleteTxt, startX + (keyCount - 1) * 132, HEIGHT - h + yOffset);
                deleteKey.onpointerup = () => clickDeleteFn(deleteKey, deleteTxt);
                this.addChild(deleteKey);
            }
        };

        // 각 줄에 맞춰 키를 생성 (마지막 줄에서만 delete 키 추가)
        keyRows.forEach((row, idx) => {
            const startX = (WIDTH - 116 * row.keyCount) / 2;
            createKeys(row.letters, row.yOffset, row.keyCount, startX, idx === keyRows.length - 1);
        });
    }

    private createButton() {
        const h = deviceType === "tablet" ? 410 : 460;

        const help = new Button("guide", 65, HEIGHT - h - 60);
        this.addChild(help);

        const skip = new Button("skip", WIDTH - 163, HEIGHT - h - 60);
        this.addChild(skip);
    }

    private updateText(text: string) {
        let newText: string = "";
        this.inputTextArray.forEach((txt, idx) => {
            if (idx === this.inputIndex) {
                txt.text = text;
            }
            newText += txt.text as string;
        });

        this.answer = newText;
    }

    private updateFocus(inputIndex: number) {
        this.inputFocusArray.forEach((focus, idx) => {
            focus.visible = idx === inputIndex;
        });
        this.inputIndex = inputIndex;
    }

    private isCorrect() {
        if (this.answer === Typing.clue?.word_view) {
            Typing.getWord();
            studyAnswerState.add();

            this.inputIndex = 0;
            this.inputTextArray = [];
            this.inputFocusArray = [];
        }
    }

    private init() {}
}

import { Container, Graphics, Sprite } from "pixi.js";
import { ASSETS, deviceType, HEIGHT, WIDTH } from "../config";
import { Button } from "./Button";

export class Keyboard extends Container {
    private h: number = 0;

    constructor(keyupEvent: (key: string) => void) {
        super();

        this.h = deviceType === "tablet" ? 410 : 460;
        this.createKeyboard(keyupEvent);
    }

    private createKeyboard(keyupEvent: (key: string) => void) {
        this.createBg();
        this.createKey(keyupEvent);
    }

    private createBg() {
        const bg = new Graphics();
        bg.rect(0, 0, WIDTH, this.h);
        bg.fill(0xa8c6e0);
        bg.y = HEIGHT - this.h;
        this.addChild(bg);
    }

    private createKey(keyupEvent: (key: string) => void) {
        const type = deviceType === "tablet" ? "Horizontal" : "Vertical";
        const keyRows = [
            { letters: "qwertyuiop", yOffset: 80, keyCount: 10 },
            { letters: "asdfghjkl", yOffset: deviceType === "tablet" ? 210 : 230, keyCount: 9 },
            { letters: "zxcvbnm", yOffset: deviceType === "tablet" ? 340 : 370, keyCount: 8 },
        ];

        const clickFn = (e: Sprite, defaultTexture: string, key: string) => {
            e.texture = ASSETS.buttons[defaultTexture];
            keyupEvent(key);
        };

        // 공통된 함수로 키 생성
        const createKeys = (letters: string, yOffset: number, keyCount: number, startX: number, isLastRow: boolean = false) => {
            [...letters].map((letter, i) => {
                const txt = `${letter}${type}`;
                const key = new Button(txt, startX + i * (deviceType === "tablet" ? 132 : 105), HEIGHT - this.h + yOffset);

                key.onpointerup = () => clickFn(key, txt, letter);
                this.addChild(key);
            });

            // 마지막 줄에만 delete 키 추가
            if (isLastRow) {
                const deleteTxt = `delete${type}`;
                const deleteKey = new Button(deleteTxt, startX + (keyCount - 1) * (deviceType === "tablet" ? 132 : 108), HEIGHT - this.h + yOffset);

                deleteKey.onpointerup = () => clickFn(deleteKey, deleteTxt, "delete");
                this.addChild(deleteKey);
            }
        };

        // 각 줄에 맞춰 키를 생성 (마지막 줄에서만 delete 키 추가)
        keyRows.forEach((row, idx) => {
            const startX = (WIDTH - (deviceType === "tablet" ? 116 : 95) * row.keyCount) / 2;
            createKeys(row.letters, row.yOffset, row.keyCount, startX, idx === keyRows.length - 1);
        });
    }
}

// src/scenes/GameScene.ts
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { TopBar } from "../components/TopBar";
import { Keyboard } from "../components/Keyboard";
import { ASSETS, deviceType, HEIGHT, soundState, WIDTH } from "../config";
import { Puzzle } from "../utils/puzzle";
import { Button } from "../components/Button";
import gsap from "gsap";
import { sound, Sound } from "@pixi/sound";

export class GameScene extends Container {
    private loadingContainer: Container = new Container();
    private puzzle = new Puzzle();

    private description: Text = new Text();
    private blockGrid: (Sprite | null)[][] = [];
    private textGrid: (Text | null)[][] = [];
    private focusSprite: Sprite = new Sprite();

    private blockSize = deviceType === "tablet" ? 55 : 52;
    private blockLeft = deviceType === "tablet" ? 50 : 47;
    private blockTop = 197;

    private hint_word_count = 0;
    private hint_letter_count = 0;
    private hint_sound_count = 0;

    private hint_word: Text = new Text();
    private hint_letter: Text = new Text();
    private hint_sound: Text = new Text();

    private word_idx: number = -1;
    private clue_correct: Text = new Text();

    constructor() {
        super();

        this.createTopBar();
        this.createBody();
        this.loadingScreen();

        this.init();
    }

    private async init() {
        await this.puzzle.setData();
        this.initSetting();

        this.createTopBar();
        this.createBody();
        this.loadingContainer.visible = false;
    }

    private loadingScreen() {
        const bg = new Graphics();
        bg.rect(0, 0, WIDTH, HEIGHT);
        bg.fill(0x000000, 0.5);

        this.loadingContainer.addChild(bg);

        const fredSprite = new AnimatedSprite(ASSETS.loading.fred);
        fredSprite.scale = 0.8;
        fredSprite.anchor.set(0.5);
        fredSprite.x = WIDTH / 2;
        fredSprite.y = HEIGHT / 2 + 100;
        fredSprite.animationSpeed = 0.2; // 애니메이션 속도 설정 (값 조정 가능)
        fredSprite.play();

        this.loadingContainer.addChild(fredSprite);

        this.addChild(this.loadingContainer);
    }

    private createTopBar() {
        const clickRefresh = () => {
            console.log(clickRefresh);
        };

        const topbar = new TopBar();
        topbar.backBtn();
        topbar.closeBtn();
        topbar.refreshBtn({ x: 170, callback: clickRefresh });

        if (deviceType !== "tablet") {
            const time = this.createTime();
            const check = this.createCheck();
            topbar.addChild(time);
            topbar.addChild(check);
        }
        this.addChild(topbar);
    }

    private createBody() {
        this.createTextBox();

        if (deviceType === "tablet") {
            const time = this.createTime();
            time.y = 160;
            time.x = 1150;

            const check = this.createCheck();
            check.y = 160;
            check.x = WIDTH - check.width - 20;

            this.addChild(time);
            this.addChild(check);
        }

        // puzzle bg 세팅
        this.createQuizBlockBg();

        // puzzle and text 세팅
        this.createQuizBlock();

        // 최초 focus 세팅
        this.createFocusBlock();

        this.createButton();
        this.keyboard();
    }

    private updateFocusBlock(x: number, y: number) {
        const position = {
            x: this.blockSize + this.blockLeft + x * this.blockSize,
            y: this.blockSize + y * this.blockSize + this.blockTop,
        };

        this.focusSprite.x = position.x;
        this.focusSprite.y = position.y;

        this.puzzle.setFocusXY(x, y);
    }

    private updateFocusBlockBg(idx: number) {
        if (!this.puzzle.selected?.word) return;
        const nextItem = this.puzzle.list[idx];

        const selectedIsHorizontal = this.puzzle.selected.d === 1;
        for (let index = 0; index < this.puzzle.selected.word.length; index++) {
            const x = this.puzzle.selected.x + (selectedIsHorizontal ? index : 0);
            const y = this.puzzle.selected.y + (!selectedIsHorizontal ? index : 0);

            if (this.puzzle.grid[x][y].mode === "input") this.blockGrid[x][y]!.texture = ASSETS.puzzle.puzzleBaseBg;
        }

        const nextIsHorizontal = nextItem.d === 1;
        for (let index = 0; index < nextItem.word.length; index++) {
            const x = nextItem.x + (nextIsHorizontal ? index : 0);
            const y = nextItem.y + (!nextIsHorizontal ? index : 0);

            if (this.puzzle.grid[x][y].mode === "input") this.blockGrid[x][y]!.texture = ASSETS.puzzle.puzzleFocusBg;
        }

        this.puzzle.setPuzzleIdx(idx);
    }

    private updateDescription() {
        this.description.text = this.puzzle.selected?.longClue ?? "";
    }

    private updateText(letter: string) {
        if (!this.puzzle.focus) return;

        const isHorizontal = this.puzzle.selected!.d === 1;
        const x = this.puzzle.selected!.x + (isHorizontal ? this.puzzle.focus.char_h_idx : 0);
        const y = this.puzzle.selected!.y + (!isHorizontal ? this.puzzle.focus.char_v_idx : 0);

        if (this.puzzle.focus.mode !== "correct") {
            this.textGrid[x][y]!.text = letter === "delete" ? "" : letter;
        }
    }

    private initSetting() {
        // 최초 문제 세팅
        this.puzzle.setPuzzleIdx(0);
        this.puzzle.setFocusXY(this.puzzle.selected!.x, this.puzzle.selected!.y);

        // 힌트 갯수 셋팅
        this.hint_word_count = Math.floor(this.puzzle.list.length * 0.3);
        this.hint_letter_count = Math.floor(this.puzzle.list.length * 0.6);
        this.hint_sound_count = Math.floor(this.puzzle.list.length * 0.4);

        if (soundState.value) {
            sound.play("puzzleSetting");
        }
    }

    private createQuizBlockBg() {
        const type = deviceType === "tablet" ? "Horizontal" : "Vertical";

        for (let yIndex = 0; yIndex < this.puzzle.VERTICAL_BOXES + 2; yIndex++) {
            for (let xIndex = 0; xIndex < this.puzzle.HORIZONTAL_BOXES + 2; xIndex++) {
                // 배경 생성
                const position = { x: this.blockLeft + xIndex * this.blockSize, y: yIndex * this.blockSize + this.blockTop };

                const bg = new Sprite(ASSETS.puzzle[`puzzleBg${type}`]);
                bg.anchor.set(0.5);

                bg.width = this.blockSize;
                bg.height = this.blockSize;

                bg.x = position.x;
                bg.y = position.y;

                this.addChild(bg);
            }
        }
    }

    private createQuizBlock() {
        if (!this.puzzle.grid.length) return;

        for (let xIndex = 0; xIndex < this.puzzle.HORIZONTAL_BOXES; xIndex++) {
            this.textGrid[xIndex] = [];
            this.blockGrid[xIndex] = [];

            for (let yIndex = 0; yIndex < this.puzzle.VERTICAL_BOXES; yIndex++) {
                const letter = this.puzzle.grid[xIndex][yIndex];
                let bgTexture = "puzzleBaseBg";

                if (letter.mode !== "disabled") {
                    const position = {
                        x: this.blockSize + this.blockLeft + xIndex * this.blockSize,
                        y: this.blockSize + yIndex * this.blockSize + this.blockTop,
                    };

                    if (letter.mode === "blank") bgTexture = "puzzleEmptyBg";

                    const bg = new Sprite(ASSETS.puzzle[bgTexture]);
                    bg.anchor.set(0.5);

                    bg.width = this.blockSize;
                    bg.height = this.blockSize;

                    bg.x = position.x;
                    bg.y = position.y;

                    if (letter.mode === "input") {
                        bg.interactive = true;
                        bg.onpointerup = () => {
                            if (letter.word_h_idx > -1 && letter.word_v_idx > -1) {
                                // 교차지점일 때
                                if (this.word_idx === letter.word_h_idx) this.word_idx = letter.word_v_idx;
                                else if (this.word_idx === letter.word_v_idx) this.word_idx = letter.word_h_idx;
                                else this.word_idx = letter.word_h_idx;
                            } else {
                                this.word_idx = letter.word_h_idx > -1 ? letter.word_h_idx : letter.word_v_idx;
                            }

                            this.updateFocusBlock(xIndex, yIndex);
                            this.updateFocusBlockBg(this.word_idx);
                            this.updateDescription();
                        };
                    }

                    this.blockGrid[xIndex][yIndex] = bg;
                    this.addChild(bg);

                    const text = new Text({
                        text: "",
                        style: {
                            fontSize: 36,
                        },
                    });
                    text.anchor.set(0.5);
                    text.x = position.x;
                    text.y = position.y;

                    this.textGrid[xIndex][yIndex] = text;
                    this.addChild(text);
                }
            }
        }
    }

    private createFocusBlock() {
        if (!this.puzzle.selected) return;

        const position = {
            x: this.blockSize + this.blockLeft + this.puzzle.selected.x * this.blockSize,
            y: this.blockSize + this.puzzle.selected.y * this.blockSize + this.blockTop,
        };

        const focus = new Sprite(ASSETS.puzzle.puzzleFocusLetter);
        focus.anchor.set(0.5);
        focus.width = this.blockSize;
        focus.height = this.blockSize;

        focus.x = position.x;
        focus.y = position.y;

        this.focusSprite = focus;
        this.addChild(focus);

        this.updateFocusBlockBg(0);
    }

    private createTime() {
        const container = new Container();
        container.x = 300;
        container.y = 30;

        const bg = new Sprite(ASSETS.puzzle[`topIconBg${deviceType === "tablet" ? "Horizontal" : "Vertical"}`]);

        const timeIcon = new Sprite(ASSETS.puzzle.timeIcon);
        timeIcon.x = deviceType === "tablet" ? -5 : 0;
        timeIcon.y = deviceType === "tablet" ? -2 : 0;

        const time = new Text({
            text: "00:00",
            style: {
                fontSize: 50,
                fill: 0xffffff,
            },
        });
        time.anchor.set(0.5);
        time.x = bg.width / 2 + 30;
        time.y = 40;

        container.addChild(bg);
        container.addChild(timeIcon);
        container.addChild(time);

        return container;
    }

    private createCheck() {
        const container = new Container();
        container.x = 550;
        container.y = 30;

        const bg = new Sprite(ASSETS.puzzle[`topIconBg${deviceType === "tablet" ? "Horizontal" : "Vertical"}`]);

        const checkIcon = new Sprite(ASSETS.puzzle.checkIcon);
        checkIcon.x = deviceType === "tablet" ? -5 : 0;
        checkIcon.y = deviceType === "tablet" ? -2 : 0;

        const check = new Text({
            text: `00/${this.puzzle.list.length < 10 ? "0" : ""}${this.puzzle.list.length}`,
            style: {
                fontSize: 50,
                fill: 0xffffff,
            },
        });
        check.anchor.set(0.5);
        check.x = bg.width / 2 + 35;
        check.y = 40;

        container.addChild(bg);
        container.addChild(checkIcon);
        container.addChild(check);
        this.clue_correct = check;

        return container;
    }

    private createTextBox() {
        const w = deviceType === "tablet" ? 740 : WIDTH - 40;
        const h = deviceType === "tablet" ? 603 : 291;

        const bg = new Graphics();
        bg.filletRect(0, 0, w, h, 20);
        bg.fill(0xffffff);
        bg.stroke({ width: 3, color: 0x597fab, alpha: 1 });

        bg.x = deviceType === "tablet" ? 1150 : 20;
        bg.y = deviceType === "tablet" ? 255 : 980;

        this.addChild(bg);

        this.createDescription(w, h, bg.x, bg.y);
    }

    private createDescription(w: number, h: number, x: number, y: number) {
        const txt = new Text({
            text: this.puzzle.selected?.longClue,
            style: {
                fontSize: 55,
            },
        });

        txt.anchor.set(0.5);
        txt.x = x + w / 2;
        txt.y = y + h / 2;
        this.description = txt;

        this.addChild(txt);
    }

    private createButton() {
        const type = deviceType === "tablet" ? "Horizontal" : "Vertical";
        const y = deviceType === "tablet" ? 935 : 1360;

        const clickFn = async (e: Sprite, defaultTexture: string, type: "showaword" | "showaletter") => {
            const count = type === "showaword" ? this.hint_word_count : this.hint_letter_count;
            e.texture = ASSETS.buttons[defaultTexture];

            if (count > 0) {
                const selected = this.puzzle.selected;
                const focus = this.puzzle.focus;

                if (!selected || !focus) return;

                const x = selected.x + (selected.d === 1 ? focus.char_h_idx : 0);
                const y = selected.y + (selected.d !== 1 ? focus.char_v_idx : 0);

                this.puzzle.setItem(x, y, selected.d, type);

                if (type === "showaword") {
                    this.hint_word_count -= 1;
                    this.hint_word.text = this.hint_word_count;

                    for (let index = 0; index < selected.word.length; index++) {
                        const x = selected.x + (selected.d === 1 ? index : 0);
                        const y = selected.y + (selected.d !== 1 ? index : 0);

                        this.puzzle.setFocusXY(x, y);
                        this.updateText(this.puzzle.grid[x][y].char);
                    }
                } else if (type === "showaletter") {
                    this.hint_letter_count -= 1;
                    this.hint_letter.text = this.hint_letter_count;

                    this.puzzle.setFocusXY(x, y);
                    this.updateText(this.puzzle.grid[x][y].char);
                }

                await this.checkWord();
                this.findNextIndex(this.puzzle.grid[x][y].char);
                this.finalCheck();
            }
        };

        const showWord = new Button(`showWord${type}`, deviceType === "tablet" ? 1290 : 230, y);
        showWord.onpointerup = () => clickFn(showWord, `showWord${type}`, "showaword");

        this.addChild(showWord);

        const showWordText = new Text({
            text: this.hint_word_count,
            style: {
                fontSize: 35,
                fill: 0xffffff,
            },
        });
        showWordText.anchor.set(0.5);
        showWordText.x = showWord.x + showWord.width / 2 - (deviceType === "tablet" ? 20 : 25);
        showWordText.y = showWord.y - showWord.height / 2 + (deviceType === "tablet" ? 20 : 25);
        this.hint_word = showWordText;
        this.addChild(showWordText);

        const showLetter = new Button(`showLetter${type}`, deviceType === "tablet" ? 1590 : 660, y);
        showLetter.onpointerup = () => clickFn(showWord, `showLetter${type}`, "showaletter");

        this.addChild(showLetter);

        const showLetterText = new Text({
            text: this.hint_letter_count,
            style: {
                fontSize: 35,
                fill: 0xffffff,
            },
        });
        showLetterText.anchor.set(0.5);
        showLetterText.x = showLetter.x + showLetter.width / 2 - (deviceType === "tablet" ? 20 : 25);
        showLetterText.y = showLetter.y - showLetter.height / 2 + (deviceType === "tablet" ? 20 : 25);
        this.hint_letter = showLetterText;
        this.addChild(showLetterText);

        const soundClickFn = (e: Sprite, defaultTexture: string) => {
            e.texture = ASSETS.buttons[defaultTexture];

            const selected = this.puzzle.selected;

            if (!selected) return;

            const sound = Sound.from(selected.sound!);
            sound.play();

            this.hint_sound_count -= 1;
            this.hint_sound.text = this.hint_sound_count;
        };

        const sound = new Button(`sound${type}`, deviceType === "tablet" ? WIDTH - 100 : WIDTH - 110, y);
        sound.onpointerup = () => soundClickFn(sound, `sound${type}`);
        this.addChild(sound);

        const showSoundText = new Text({
            text: this.hint_sound_count,
            style: {
                fontSize: 35,
                fill: 0xffffff,
            },
        });
        showSoundText.anchor.set(0.5);
        showSoundText.x = sound.x + sound.width / 2 - (deviceType === "tablet" ? 20 : 25);
        showSoundText.y = sound.y - sound.height / 2 + (deviceType === "tablet" ? 20 : 25);
        this.hint_sound = showSoundText;
        this.addChild(showSoundText);
    }

    private keyboard() {
        const clickFn = async (key: string) => {
            this.updateText(key);
            await this.checkWord();
            this.findNextIndex(key);
            this.finalCheck();
        };
        const keyboard = new Keyboard(clickFn);
        this.addChild(keyboard);
    }

    private async checkWord() {
        const selected = this.puzzle.selected;
        const focus = this.puzzle.focus;

        if (!selected || !focus) return;

        // x 검사
        if (focus.word_h_idx > -1) {
            let isCorrect = true;
            for (let i = 0; i < selected.word.length; i++) {
                if (selected.word[i] !== this.textGrid[selected.x + i][selected.y]?.text) {
                    isCorrect = false;
                    break;
                }
            }

            if (isCorrect) await this.correctWord(1, 0);
        }

        // y 검사
        if (focus.word_v_idx > -1) {
            let isCorrect = true;
            for (let i = 0; i < selected.word.length; i++) {
                if (selected.word[i] !== this.textGrid[selected.x][selected.y + i]?.text) {
                    isCorrect = false;
                    break;
                }
            }

            if (isCorrect) await this.correctWord(0, 1);
        }
    }

    private async correctWord(dx: number, dy: number) {
        const selected = this.puzzle.selected;
        const focus = this.puzzle.focus;

        if (!selected || !focus) return;

        const promises = [];

        for (let i = 0; i < selected.word.length; i++) {
            const x = selected.x + i * dx;
            const y = selected.y + i * dy;

            promises.push(
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        this.puzzle.setMode(x, y, dx > 0 ? focus.word_h_idx : focus.word_v_idx, "correct");
                        this.puzzle.setPuzzleIdx(dx > 0 ? focus.word_h_idx : focus.word_v_idx);
                        this.blockGrid[x][y]!.texture = ASSETS.puzzle.puzzleCorrectBg;
                        this.blockGrid[x][y]!.onpointerup = () => {
                            this.updateFocusBlock(x, y);
                        };

                        this.textGrid[x][y]!.style.fill = 0xffffff;
                        this.particle(this.blockGrid[x][y]!.x, this.blockGrid[x][y]!.y);

                        resolve();
                    }, i * 100);
                })
            );
        }

        await Promise.all(promises);
    }

    private findNextIndex(letter: string) {
        const selected = this.puzzle.selected;
        const focus = this.puzzle.focus;

        if (!focus || !selected) return;

        if (selected.mode === "correct") {
            const index = focus.word_h_idx > -1 ? focus.word_h_idx : focus.word_v_idx;
            let newIdx = index;
            const totalWords = this.puzzle.list.length;

            for (let i = 0; i < totalWords; i++) {
                newIdx = (newIdx + 1) % totalWords;
                if (this.puzzle.list[newIdx].mode === "input") break;
            }

            this.updateFocusBlockBg(newIdx);
            this.updateFocusBlock(this.puzzle.selected!.x, this.puzzle.selected!.y);
            this.updateDescription();
        } else {
            const isHorizontal = selected.d === 1;
            const x = selected.x + (isHorizontal ? focus.char_h_idx : 0);
            const y = selected.y + (!isHorizontal ? focus.char_v_idx : 0);

            const nextX = x + (isHorizontal ? 1 : 0) * (letter === "delete" ? -1 : 1);
            const nextY = y + (!isHorizontal ? 1 : 0) * (letter === "delete" ? -1 : 1);

            if (nextX < 0 || nextY < 0 || nextX > this.puzzle.HORIZONTAL_BOXES || nextY > this.puzzle.VERTICAL_BOXES) return;

            if (this.puzzle.grid[nextX][nextY].mode !== "disabled") {
                this.updateFocusBlock(nextX, nextY);
            }
        }
    }

    private particle(x: number, y: number) {
        const particleCount = 40; // 초당 40개 생성
        const duration = 1.5; // 입자가 사라지는 시간

        const particleContainer = new Container();
        this.addChild(particleContainer);

        for (let i = 0; i < particleCount; i++) {
            const particle = new Sprite(ASSETS.puzzle.particle);
            particle.width = 10;
            particle.height = 10;
            particle.x = x;
            particle.y = y;
            particle.anchor.set(0.5);

            particleContainer.addChild(particle);

            // 랜덤한 360도 방향으로 이동
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50; // 이동 거리

            gsap.to(particle, {
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0, // 점점 투명해짐
                duration: duration,
                ease: "power2.out",
                onComplete: () => {
                    particleContainer.removeChild(particle);
                    particle.destroy();
                },
            });
        }
    }

    private finalCheck() {
        const isFinish = this.puzzle.list.every((list) => list.mode === "correct");

        const correctNum = this.puzzle.list.filter((list) => {
            return list.mode === "correct" && (list.item === "" || list.item === "showaletter1");
        }).length;

        const total = this.puzzle.list.length < 10 ? `0${this.puzzle.list.length}` : this.puzzle.list.length;
        const correct = correctNum < 10 ? `0${correctNum}` : correctNum;

        this.clue_correct.text = `${correct}/${total}`;

        if (isFinish) {
            console.log("끝");
        }
    }
}

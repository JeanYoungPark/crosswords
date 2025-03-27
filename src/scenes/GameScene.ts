// src/scenes/GameScene.ts
import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { TopBar } from "../components/TopBar";
import { Keyboard } from "../components/Keyboard";
import { ASSETS, deviceType } from "../config";

export class GameScene extends Container {
    constructor() {
        super();

        this.createTopBar();
        this.createBody();
    }

    private createTopBar() {
        const clickRefresh = () => {
            console.log(clickRefresh);
        };

        const topbar = new TopBar();
        topbar.backBtn();
        topbar.closeBtn();
        topbar.refreshBtn({ x: 170, callback: clickRefresh });

        const time = this.createTime();
        const check = this.createCheck();
        topbar.addChild(time);
        topbar.addChild(check);
        this.addChild(topbar);
    }

    private createBody() {
        this.keyboard();
    }

    private createTime() {
        const container = new Container();
        container.x = 300;
        container.y = 30;

        const bg = new Sprite(ASSETS.puzzle[`topIconBg${deviceType === "tablet" ? "Horizontal" : "Vertical"}`]);

        const timeIcon = new Sprite(ASSETS.puzzle.timeIcon);

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

        const check = new Text({
            text: "00/10",
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

        return container;
    }

    private keyboard() {
        const clickFn = () => {};
        const keyboard = new Keyboard(clickFn);
        this.addChild(keyboard);
    }
}

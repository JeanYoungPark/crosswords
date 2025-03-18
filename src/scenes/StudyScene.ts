// src/scenes/StudyScene.ts
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

export class StudyScene extends PIXI.Container {
    private app: PIXI.Application;

    constructor(app: PIXI.Application, onStartGame: () => void) {
        super();
        this.app = app;
    }

    // 버튼 생성 헬퍼 함수
    private createButton(label: string, x: number, y: number, onClick: () => void) {}
}

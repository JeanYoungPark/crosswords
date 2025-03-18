// src/scenes/GameScene.ts
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

export class GameScene extends PIXI.Container {
    private app: PIXI.Application;
    private score: number = 0;

    constructor(app: PIXI.Application, onBackToStudy: () => void) {
        super();
        this.app = app;
    }

    // 점수 업데이트
    private updateScore(points: number) {
        this.score += points;
    }

    // 게임 업데이트 루프
    private update(delta: number) {
        // 여기에 게임 로직 추가
        // 예: 충돌 감지, 타이머 등
    }

    // 게임 정리 (메모리 해제)
    public destroy() {}

    // 버튼 생성 헬퍼 함수
    private createButton(label: string, width: number, height: number, onClick: () => void): PIXI.Container {}
}

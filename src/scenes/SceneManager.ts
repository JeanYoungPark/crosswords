// src/scenes/SceneManager.ts
import * as PIXI from "pixi.js";

export class SceneManager {
    private currentScene: PIXI.Container | null = null;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
    }

    // 씬 전환
    switchScene(newScene: PIXI.Container) {
        // 현재 씬이 있다면 제거
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
        }

        // 새 씬 추가
        this.currentScene = newScene;
        this.app.stage.addChild(this.currentScene);
    }

    // 현재 씬 가져오기
    getCurrentScene(): PIXI.Container | null {
        return this.currentScene;
    }
}

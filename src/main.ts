import { SceneManager } from "./scenes/SceneManager";
import { LoadingScene } from "./scenes/LoadingScene";
import { StudyScene } from "./scenes/StudyScene";
import { GameScene } from "./scenes/GameScene";
import { Application } from "pixi.js";
import { HEIGHT, WIDTH, os, SoundState, ScaleState } from "./config";
import "./style.css";
import { IntroScene } from "./scenes/IntroScene";
import { GuideScene } from "./scenes/GuideScene";

// 애플리케이션 생성
const app = new Application();

await app.init({
    backgroundColor: "#b8dbff",
});

// HTML 문서에 PixiJS 캔버스 추가
document.body.appendChild(app.canvas);

const resizeApp = () => {
    ScaleState.update();

    const w = Math.min(WIDTH, WIDTH * ScaleState.value);
    const h = Math.min(HEIGHT, HEIGHT * ScaleState.value);
    app.renderer.resize(w, h);
    app.stage.scale.set(ScaleState.value);
};

window.addEventListener("resize", resizeApp);
resizeApp();

window.addEventListener("load", () => {
    if (os === "IOS") SoundState.set(false);
});

// 씬 매니저 생성
const sceneManager = new SceneManager(app);

// 로딩 씬 표시 후 인트로 전환
const loadingScene = new LoadingScene(() => {
    sceneManager.switchScene(new IntroScene({ onStudyStart: startStudy, onShowGuide: showGuide }));
});

// 가이드 시작 함수
function showGuide() {
    sceneManager.switchScene(new GuideScene());
}

// 공부 시작 함수
function startStudy() {
    sceneManager.switchScene(new StudyScene(app, backToStudy));
}

// 게임 시작 함수
function startGame() {
    sceneManager.switchScene(new GameScene(app, backToStudy));
}

// 공부 화면으로 돌아가는 함수
function backToStudy() {
    // 기존 게임 씬을 메모리에서 정리
    const currentScene = sceneManager.getCurrentScene();
    if (currentScene instanceof GameScene) {
        currentScene.destroy();
    }

    sceneManager.switchScene(new StudyScene(app, startGame));
}

// 초기 로딩 씬 표시
sceneManager.switchScene(loadingScene);

import { SceneManager } from "./scenes/SceneManager";
import { LoadingScene } from "./scenes/LoadingScene";
import { StudyScene } from "./scenes/StudyScene";
import { GameScene } from "./scenes/GameScene";
import { Application } from "pixi.js";
import { deviceType, HEIGHT, SCALE, WIDTH, setScale } from "./config";
import "./style.css";

// 애플리케이션 생성
const app = new Application();

await app.init({
    backgroundColor: "#b8dbff",
});

// HTML 문서에 PixiJS 캔버스 추가
document.body.appendChild(app.canvas);

const resizeApp = () => {
    setScale();

    const w = Math.min(WIDTH, WIDTH * SCALE);
    const h = Math.min(HEIGHT, window.innerHeight);
    app.renderer.resize(w, h);
    app.stage.scale.set(SCALE);
};

window.addEventListener("resize", resizeApp);
resizeApp();

// 씬 매니저 생성
const sceneManager = new SceneManager(app);

// 로딩 씬 표시
const loadingScene = new LoadingScene(() => {
    // 로딩 완료 후 공부 화면으로 전환
    sceneManager.switchScene(new StudyScene(app, startGame));
});

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

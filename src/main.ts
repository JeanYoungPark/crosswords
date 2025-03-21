import { SceneManager } from "./scenes/SceneManager";
import { LoadingScene } from "./scenes/LoadingScene";
import { StudyScene } from "./scenes/StudyScene";
import { Application } from "pixi.js";
import { HEIGHT, WIDTH, os, SoundState, ScaleState } from "./config";
import "./style.css";
import { IntroScene } from "./scenes/IntroScene";
import { GuideScene } from "./scenes/GuideScene";

const app = new Application();

// 애플리케이션 생성
async function init() {
    await app.init({ backgroundColor: "#b8dbff" });
    document.body.appendChild(app.canvas);

    resizeApp();

    const sceneManager = new SceneManager(app);

    const loadingScene = new LoadingScene(() => {
        sceneManager.switchScene(new IntroScene({ onStudyStart: startStudy, onShowGuide: showGuide }));
    });

    function showGuide() {
        sceneManager.switchScene(new GuideScene());
    }

    function startStudy() {
        sceneManager.switchScene(new StudyScene());
    }

    sceneManager.switchScene(loadingScene);
}

const resizeApp = () => {
    ScaleState.update();

    const w = Math.min(WIDTH, WIDTH * ScaleState.value);
    const h = Math.min(HEIGHT, HEIGHT * ScaleState.value);
    app.renderer.resize(w, h);
    app.stage.scale.set(ScaleState.value);
};

window.addEventListener("resize", resizeApp);

(() => {
    if (os === "IOS") SoundState.set(false);
})();

init();

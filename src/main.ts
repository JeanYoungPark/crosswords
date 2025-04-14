import { SceneManager } from "./scenes/SceneManager";
import { LoadingScene } from "./scenes/LoadingScene";
import { Application } from "pixi.js";
import { HEIGHT, WIDTH, os, soundState, ScaleState } from "./config";
import { IntroScene } from "./scenes/IntroScene";
import "./style.css";

const app = new Application();
export const sceneManager: SceneManager = new SceneManager(app);

// 애플리케이션 생성
async function init() {
    await app.init({ backgroundColor: "#b8dbff", antialias: true });
    document.body.appendChild(app.canvas);

    resizeApp();

    const loadingScene = new LoadingScene(() => {
        sceneManager.switchScene(new IntroScene());
    });

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
    if (os === "IOS") soundState.set(false);
})();

init();

import { Container, Sprite, Assets, Texture, AnimatedSprite } from "pixi.js";
import { HEIGHT, WIDTH, ASSETS } from "../config";
import { ASSET_PATHS } from "../assets/assets";
import { getTypingWordXml, getTypingWordXml1, getTypingWordXml2 } from "../apis/get";
import Typing from "../utils/typing";

export class LoadingScene extends Container {
    private onComplete: () => void;

    constructor(onComplete: () => void) {
        super();
        this.onComplete = onComplete;

        // 즉시 로딩 화면 표기
        this.showLoadingScreen();

        // 로고 이미지 로드 (실제 이미지 경로로 변경 필요)
        this.loadAssets();
    }

    private async showLoadingScreen() {
        await this.loadInitialAssets();

        // background
        const block = new Sprite(ASSETS.loading.bgBlock);
        block.anchor.set(0.5);
        block.x = WIDTH / 2;
        block.y = HEIGHT / 2;

        // logo
        const logo = Sprite.from(ASSETS.loading.logo);
        logo.anchor.set(0.5);
        logo.x = WIDTH / 2;
        logo.y = HEIGHT / 2 - 150;

        const fredSprite = new AnimatedSprite(ASSETS.loading.fred);
        fredSprite.scale = 0.8;
        fredSprite.anchor.set(0.5);
        fredSprite.x = WIDTH / 2;
        fredSprite.y = HEIGHT / 2 + 100;
        fredSprite.animationSpeed = 0.2; // 애니메이션 속도 설정 (값 조정 가능)
        fredSprite.play();

        this.addChild(block);
        this.addChild(logo);
        this.addChild(fredSprite);
    }

    private async loadInitialAssets() {
        // 로딩 화면에 필요한 에셋만 먼저 로드
        ASSETS.loading.bgBlock = await Assets.load(ASSET_PATHS.loading.bgBlock);
        ASSETS.loading.logo = await Assets.load(ASSET_PATHS.loading.logo);

        // fred 애니메이션 로드
        const animTextures: Texture[] = [];
        for (const animPath of ASSET_PATHS.loading.fred) {
            const texture = await Assets.load(animPath);
            animTextures.push(texture);
        }
        ASSETS.loading.fred = animTextures;
    }

    // 에셋 로딩
    private async loadAssets() {
        try {
            for (const [name, path] of Object.entries(ASSET_PATHS.buttons)) {
                if (!ASSETS.buttons) ASSETS.buttons = {};
                ASSETS.buttons[name] = await Assets.load(path);
                ASSETS.buttons[name] = ASSETS.buttons[name];
            }

            // 인트로 에셋 로드
            for (const [name, path] of Object.entries(ASSET_PATHS.intro)) {
                if (!ASSETS.intro) ASSETS.intro = {};
                ASSETS.intro[name] = await Assets.load(path);
                ASSETS.intro[name] = ASSETS.intro[name];
            }

            // 스터디 에셋 로드 (있다면)
            for (const [name, path] of Object.entries(ASSET_PATHS.study)) {
                if (!ASSETS.study) ASSETS.study = {};
                ASSETS.study[name] = await Assets.load(path);
                ASSETS.study[name] = ASSETS.study[name];
            }

            // 가이드 (있다면)
            for (const [name, path] of Object.entries(ASSET_PATHS.guide)) {
                if (!ASSETS.guide) ASSETS.guide = {};
                ASSETS.guide[name] = await Assets.load(path);
                ASSETS.guide[name] = ASSETS.guide[name];
            }

            // 퍼즐 (있다면)
            for (const [name, path] of Object.entries(ASSET_PATHS.puzzle)) {
                if (!ASSETS.puzzle) ASSETS.puzzle = {};
                ASSETS.puzzle[name] = await Assets.load(path);
                ASSETS.puzzle[name] = ASSETS.puzzle[name];
            }

            const xml = await getTypingWordXml();
            const xml1 = await getTypingWordXml1();
            const xml2 = await getTypingWordXml2();

            if (xml) {
                const xmlString = await xml.text();
                Typing.setData(xmlString);
            }

            setTimeout(() => {
                if (this.onComplete) this.onComplete();
            }, 500);
        } catch (error) {
            console.error("에셋 로딩 중 오류 발생:", error);
        }
    }
}

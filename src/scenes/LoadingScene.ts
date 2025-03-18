// src/scenes/LoadingScene.ts
import { Application, Container, Sprite, Assets, Texture, AnimatedSprite } from "pixi.js";
import { HEIGHT, WIDTH } from "../config";

export class LoadingScene extends Container {
    private loadingLogo: Sprite | null = null;
    private onComplete: () => void;

    constructor(app: Application, onComplete: () => void) {
        super();
        // this.onComplete = onComplete;

        // 즉시 로딩 화면 표기
        this.showLoadingScreen();

        // 로고 이미지 로드 (실제 이미지 경로로 변경 필요)
        this.loadAssets(app);
    }

    private async showLoadingScreen() {
        const blockTexture = await Assets.load("/loading/bg_block.png");
        const block = new Sprite(blockTexture);
        block.anchor.set(0.5);
        block.x = WIDTH / 2;
        block.y = HEIGHT / 2;

        const logoTexture = await Assets.load("/loading/logo.png");
        const logo = Sprite.from(logoTexture);
        logo.anchor.set(0.5);
        logo.x = WIDTH / 2;
        logo.y = HEIGHT / 2 - 150;

        const animImages = [
            "/loading/anim01.png",
            "/loading/anim02.png",
            "/loading/anim03.png",
            "/loading/anim04.png",
            "/loading/anim05.png",
            "/loading/anim06.png",
        ];

        const animTextureArr: Texture[] = [];

        for (let i = 0; i < animImages.length; i++) {
            const texture = await Assets.load(animImages[i]);
            animTextureArr.push(texture);
        }

        console.log(animTextureArr);
        const fredSprite = new AnimatedSprite(animTextureArr);
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

    // 에셋 로딩
    private loadAssets(app: Application) {}
}

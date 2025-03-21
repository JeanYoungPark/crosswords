import { Container, Sprite, Assets, Texture, AnimatedSprite } from "pixi.js";
import { HEIGHT, IMAGE_ASSETS, WIDTH } from "../config";
import { ASSETS } from "../assets/assets";

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
        // background
        const blockTexture = await Assets.load(ASSETS.loading.bgBlock);
        const block = new Sprite(blockTexture);
        block.anchor.set(0.5);
        block.x = WIDTH / 2;
        block.y = HEIGHT / 2;

        // logo
        const logoTexture = await Assets.load(ASSETS.loading.logo);
        const logo = Sprite.from(logoTexture);
        logo.anchor.set(0.5);
        logo.x = WIDTH / 2;
        logo.y = HEIGHT / 2 - 150;

        // fred anim
        const animImages = ASSETS.loading.fred;
        const animTextureArr: Texture[] = [];

        for (let i = 0; i < animImages.length; i++) {
            const texture = await Assets.load(animImages[i]);
            animTextureArr.push(texture);
        }

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
    private async loadAssets() {
        const assetsToLoad: Record<string, any> = ASSETS;

        for (const key of Object.keys(assetsToLoad)) {
            const assets: Record<string, string> = assetsToLoad[key];

            if (!IMAGE_ASSETS[key]) IMAGE_ASSETS[key] = {};

            for (const [name, path] of Object.entries(assets)) {
                const texture = await Assets.load(path);
                IMAGE_ASSETS[key][name] = texture;
            }
        }

        setTimeout(() => {
            if (this.onComplete) this.onComplete();
        }, 500);
    }
}

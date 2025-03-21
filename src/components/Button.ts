import { Sprite } from "pixi.js";
import { IMAGE_ASSETS } from "../config";

export class Button extends Sprite {
    private defaultTexture: string;

    constructor(defaultTexture: string, x: number, y: number) {
        super(IMAGE_ASSETS.buttons[defaultTexture]);

        this.defaultTexture = defaultTexture;

        this.x = x;
        this.y = y;

        this.anchor.set(0.5);
        this.interactive = true;
        this.accessibleType = "button";

        this.setupEvents();
    }

    private setupEvents() {
        this.onpointerdown = this.handlePointerDown;
        this.onpointerupoutside = this.handlePointerUpOurSide;
    }

    private handlePointerDown = () => {
        this.texture = IMAGE_ASSETS.buttons[`${this.defaultTexture}Touch`];
    };

    private handlePointerUpOurSide = () => {
        this.texture = IMAGE_ASSETS.buttons[this.defaultTexture];
    };
}

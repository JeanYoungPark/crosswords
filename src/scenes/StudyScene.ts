import { Container } from "pixi.js";
import { TopBar } from "../components/TopBar";

export class StudyScene extends Container {
    constructor() {
        super();

        this.createTopBar();
    }

    private createTopBar() {
        const topbar = new TopBar();
        this.addChild(topbar);
    }
}

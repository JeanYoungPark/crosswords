import { Application, Container } from "pixi.js";
import { getContentInfo } from "../apis/get";

export class StudyScene extends Container {
    private app: Application;

    constructor(app: Application, onStartGame: () => void) {
        super();
        this.app = app;

        this.getData();
        this.createUI();
    }

    private async getData() {
        const res = await getContentInfo();
        console.log(res);
    }

    private async createUI() {}

    // 버튼 생성 헬퍼 함수
    private createButton(label: string, x: number, y: number, onClick: () => void) {}
}

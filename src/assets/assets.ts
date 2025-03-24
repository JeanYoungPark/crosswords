// 애니메이션 변환 함수
const sortAnim = (anim: object) => {
    return Object.entries(anim)
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
        .map(([_, module]) => module.default);
};

const fredAnim = import.meta.glob("../assets/images/loading/anim*.png", { eager: true });

export const ASSET_PATHS: Record<string, Record<string, any>> = {
    loading: {
        bgBlock: new URL("../assets/images/loading/bg_block.png", import.meta.url).href,
        logo: new URL("../assets/images/loading/logo.png", import.meta.url).href,
        fred: sortAnim(fredAnim),
    },

    buttons: {
        soundOn: new URL("../assets/images/buttons/sound_on_btn.png", import.meta.url).href,
        soundOnTouch: new URL("../assets/images/buttons/sound_on_touch_btn.png", import.meta.url).href,
        soundOff: new URL("../assets/images/buttons/sound_off_btn.png", import.meta.url).href,
        soundOffTouch: new URL("../assets/images/buttons/sound_off_touch_btn.png", import.meta.url).href,

        close: new URL("../assets/images/buttons/close_btn.png", import.meta.url).href,
        closeTouch: new URL("../assets/images/buttons/close_touch_btn.png", import.meta.url).href,

        startHorizontal: new URL("../assets/images/buttons/start_horizontal_btn.png", import.meta.url).href,
        startHorizontalTouch: new URL("../assets/images/buttons/start_horizontal_touch_btn.png", import.meta.url).href,
        startVertical: new URL("../assets/images/buttons/start_vertical_btn.png", import.meta.url).href,
        startVerticalTouch: new URL("../assets/images/buttons/start_vertical_touch_btn.png", import.meta.url).href,

        round1Horizontal: new URL("../assets/images/buttons/round1_horizontal_btn.png", import.meta.url).href,
        round1HorizontalTouch: new URL("../assets/images/buttons/round1_horizontal_touch_btn.png", import.meta.url).href,
        round1Vertical: new URL("../assets/images/buttons/round1_vertical_btn.png", import.meta.url).href,
        round1VerticalTouch: new URL("../assets/images/buttons/round1_vertical_touch_btn.png", import.meta.url).href,
        round2Horizontal: new URL("../assets/images/buttons/round2_horizontal_btn.png", import.meta.url).href,
        round2HorizontalTouch: new URL("../assets/images/buttons/round2_horizontal_touch_btn.png", import.meta.url).href,
        round2Vertical: new URL("../assets/images/buttons/round2_vertical_btn.png", import.meta.url).href,
        round2VerticalTouch: new URL("../assets/images/buttons/round2_vertical_touch_btn.png", import.meta.url).href,

        guide: new URL("../assets/images/buttons/guide_btn.png", import.meta.url).href,
        guideTouch: new URL("../assets/images/buttons/guide_touch_btn.png", import.meta.url).href,

        back: new URL("../assets/buttons/back_btn.png", import.meta.url).href,
        backTouch: new URL("../assets/buttons/back_touch_btn.png", import.meta.url).href,
    },

    intro: {
        bgBlock: new URL("../assets/images/intro/bg_block.png", import.meta.url).href,
        title: new URL("../assets/images/intro/title.png", import.meta.url).href,
        textBg: new URL("../assets/images/intro/text_bg.png", import.meta.url).href,
    },

    guide: {
        bgHorizontal: new URL("../assets/images/guide/bg_horizontal.png", import.meta.url).href,
        bgVertical: new URL("../assets/images/guide/bg_vertical.png", import.meta.url).href,
    },

    study: {},
};

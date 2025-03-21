// 애니메이션 변환 함수
const sortAnim = (anim: object) => {
    return Object.entries(anim)
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
        .map(([_, module]) => module.default);
};

const fredAnim = import.meta.glob("../assets/images/loading/anim*.png", { eager: true });

export const ASSETS: Record<string, Record<string, any>> = {
    loading: {
        bgBlock: (await import("../assets/images/loading/bg_block.png")).default,
        logo: (await import("../assets/images/loading/logo.png")).default,
        fred: sortAnim(fredAnim),
    },

    buttons: {
        soundOn: (await import(`../assets/images/buttons/sound_on_btn.png`)).default,
        soundOnTouch: (await import(`../assets/images/buttons/sound_on_touch_btn.png`)).default,
        soundOff: (await import(`../assets/images/buttons/sound_off_btn.png`)).default,
        soundOffTouch: (await import(`../assets/images/buttons/sound_off_touch_btn.png`)).default,

        close: (await import(`../assets/images/buttons/close_btn.png`)).default,
        closeTouch: (await import(`../assets/images/buttons/close_touch_btn.png`)).default,

        startHorizontal: (await import(`../assets/images/buttons/start_horizontal_btn.png`)).default,
        startHorizontalTouch: (await import(`../assets/images/buttons/start_horizontal_touch_btn.png`)).default,
        startVertical: (await import(`../assets/images/buttons/start_vertical_btn.png`)).default,
        startVerticalTouch: (await import(`../assets/images/buttons/start_vertical_touch_btn.png`)).default,

        round1Horizontal: (await import(`../assets/images/buttons/round1_horizontal_btn.png`)).default,
        round1HorizontalTouch: (await import(`../assets/images/buttons/round1_horizontal_touch_btn.png`)).default,
        round1Vertical: (await import(`../assets/images/buttons/round1_vertical_btn.png`)).default,
        round1VerticalTouch: (await import(`../assets/images/buttons/round1_vertical_touch_btn.png`)).default,
        round2Horizontal: (await import(`../assets/images/buttons/round2_horizontal_btn.png`)).default,
        round2HorizontalTouch: (await import(`../assets/images/buttons/round2_horizontal_touch_btn.png`)).default,
        round2Vertical: (await import(`../assets/images/buttons/round2_vertical_btn.png`)).default,
        round2VerticalTouch: (await import(`../assets/images/buttons/round2_vertical_touch_btn.png`)).default,

        guide: (await import(`../assets/images/buttons/guide_btn.png`)).default,
        guideTouch: (await import(`../assets/images/buttons/guide_touch_btn.png`)).default,
    },

    intro: {
        bgBlock: (await import(`../assets/images/intro/bg_block.png`)).default,
        title: (await import(`../assets/images/intro/title.png`)).default,
        textBg: (await import(`../assets/images/intro/text_bg.png`)).default,
    },

    study: {},
};

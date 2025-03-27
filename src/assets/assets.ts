// 애니메이션 변환 함수
const sortAnim = (anim: object) => {
    return Object.entries(anim)
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
        .map(([_, module]) => module.default);
};

const fredAnim = import.meta.glob("../assets/images/loading/anim*.png", { eager: true });
const keyboardImages: Record<string, { default: string }> = import.meta.glob("../assets/images/keyboard/*/*.png", { eager: true });

const keyboardMap: Record<string, string> = Object.entries(keyboardImages).reduce((acc, [path, module]) => {
    const match = path.match(/\/(horizontal||vertical)\/([a-z])(_touch)?\.png$/);

    if (match) {
        const capitalized = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        const key = match[2] + capitalized + (match[3] ? "Touch" : "");
        acc[key] = module.default;
    }
    return acc;
}, {} as Record<string, string>);

const keyboard = Object.fromEntries(
    [..."abcdefghijklmnopqrstuvwxyz"].flatMap((letter) => [
        [`${letter}Horizontal`, keyboardMap[`${letter}Horizontal`] || ""],
        [`${letter}HorizontalTouch`, keyboardMap[`${letter}HorizontalTouch`] || ""],
        [`${letter}Vertical`, keyboardMap[`${letter}Vertical`] || ""],
        [`${letter}VerticalTouch`, keyboardMap[`${letter}VerticalTouch`] || ""],
    ])
);

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

        back: new URL("../assets/images/buttons/back_btn.png", import.meta.url).href,
        backTouch: new URL("../assets/images/buttons/back_touch_btn.png", import.meta.url).href,

        ...keyboard,

        deleteHorizontal: new URL("../assets/images/keyboard/horizontal/delete.png", import.meta.url).href,
        deleteHorizontalTouch: new URL("../assets/images/keyboard/horizontal/delete_touch.png", import.meta.url).href,
        deleteVertical: new URL("../assets/images/keyboard/vertical/delete.png", import.meta.url).href,
        deleteVerticalTouch: new URL("../assets/images/keyboard/vertical/delete_touch.png", import.meta.url).href,

        skip: new URL("../assets/images/buttons/skip_btn.png", import.meta.url).href,
        skipTouch: new URL("../assets/images/buttons/skip_touch_btn.png", import.meta.url).href,
    },

    intro: {
        bgBlock: new URL("../assets/images/intro/bg_block.png", import.meta.url).href,
        title: new URL("../assets/images/intro/title.png", import.meta.url).href,
        textBg: new URL("../assets/images/intro/text_bg.png", import.meta.url).href,
    },

    guide: {
        bgHorizontal: new URL("../assets/images/guide/bg_horizontal.png", import.meta.url).href,
        bgVertical: new URL("../assets/images/guide/bg_vertical.png", import.meta.url).href,
        krHorizontal: new URL("../assets/images/guide/guide_kr_horizontal.png", import.meta.url).href,
        krVertical: new URL("../assets/images/guide/guide_kr_vertical.png", import.meta.url).href,
    },

    study: {
        input: new URL("../assets/images/study/input.png", import.meta.url).href,
        inputFocus: new URL("../assets/images/study/focus.png", import.meta.url).href,
        lightOn: new URL("../assets/images/study/light_on.png", import.meta.url).href,
        lightOff: new URL("../assets/images/study/light_off.png", import.meta.url).href,
        lightOnBg: new URL("../assets/images/study/light_on_bg.png", import.meta.url).href,
        lightOffBg: new URL("../assets/images/study/light_off_bg.png", import.meta.url).href,
        infoKrHorizontal: new URL("../assets/images/study/info_kr_horizontal.png", import.meta.url).href,
        infoCnHorizontal: new URL("../assets/images/study/info_cn_horizontal.png", import.meta.url).href,
        infoHkHorizontal: new URL("../assets/images/study/info_hk_horizontal.png", import.meta.url).href,
        infoJpHorizontal: new URL("../assets/images/study/info_jp_horizontal.png", import.meta.url).href,
        infoKrVertical: new URL("../assets/images/study/info_kr_vertical.png", import.meta.url).href,
        infoCnVertical: new URL("../assets/images/study/info_cn_vertical.png", import.meta.url).href,
        infoHkVertical: new URL("../assets/images/study/info_hk_vertical.png", import.meta.url).href,
        infoJpVertical: new URL("../assets/images/study/info_jp_vertical.png", import.meta.url).href,
    },
};

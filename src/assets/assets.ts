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

        refresh: new URL("../assets/images/buttons/refresh_btn.png", import.meta.url).href,
        refreshTouch: new URL("../assets/images/buttons/refresh_touch_btn.png", import.meta.url).href,

        showWordHorizontal: new URL("../assets/images/puzzle/show_word_btn_horizontal.png", import.meta.url).href,
        showWordHorizontalTouch: new URL("../assets/images/puzzle/show_word_touch_btn_horizontal.png", import.meta.url).href,
        showWordVertical: new URL("../assets/images/puzzle/show_word_btn_vertical.png", import.meta.url).href,
        showWordVerticalTouch: new URL("../assets/images/puzzle/show_word_touch_btn_vertical.png", import.meta.url).href,
        showLetterHorizontal: new URL("../assets/images/puzzle/show_letter_btn_horizontal.png", import.meta.url).href,
        showLetterHorizontalTouch: new URL("../assets/images/puzzle/show_letter_touch_btn_horizontal.png", import.meta.url).href,
        showLetterVertical: new URL("../assets/images/puzzle/show_letter_btn_vertical.png", import.meta.url).href,
        showLetterVerticalTouch: new URL("../assets/images/puzzle/show_letter_touch_btn_vertical.png", import.meta.url).href,
        soundHorizontal: new URL("../assets/images/puzzle/sound_btn_horizontal.png", import.meta.url).href,
        soundHorizontalTouch: new URL("../assets/images/puzzle/sound_touch_btn_horizontal.png", import.meta.url).href,
        soundVertical: new URL("../assets/images/puzzle/sound_btn_vertical.png", import.meta.url).href,
        soundVerticalTouch: new URL("../assets/images/puzzle/sound_touch_btn_vertical.png", import.meta.url).href,
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

    puzzle: {
        topIconBgHorizontal: new URL("../assets/images/puzzle/top_icon_bg_horizontal.png", import.meta.url).href,
        topIconBgVertical: new URL("../assets/images/puzzle/top_icon_bg_vertical.png", import.meta.url).href,
        timeIcon: new URL("../assets/images/puzzle/time.png", import.meta.url).href,
        checkIcon: new URL("../assets/images/puzzle/check.png", import.meta.url).href,
        puzzleBgHorizontal: new URL("../assets/images/puzzle/puzzle_bg_horizontal.png", import.meta.url).href,
        puzzleBgVertical: new URL("../assets/images/puzzle/puzzle_bg_vertical.png", import.meta.url).href,
        puzzleBaseBg: new URL("../assets/images/puzzle/puzzle_base_bg.png", import.meta.url).href,
        puzzleFocusBg: new URL("../assets/images/puzzle/puzzle_focus_bg.png", import.meta.url).href,
        puzzleEmptyBg: new URL("../assets/images/puzzle/puzzle_empty_bg.png", import.meta.url).href,
        puzzleCorrectBg: new URL("../assets/images/puzzle/puzzle_correct_bg.png", import.meta.url).href,
        puzzleFocusLetter: new URL("../assets/images/puzzle/puzzle_focus_letter.png", import.meta.url).href,
        particle: new URL("../assets/images/puzzle/particle.png", import.meta.url).href,
    },
};

export const SOUND_ASSET_PATHS: Record<string, string> = {
    lobbyBgm: new URL("../assets/sounds/lobbyBgm.mp3", import.meta.url).href,
    startBtn: new URL("../assets/sounds/startBtn.mp3", import.meta.url).href,
    puzzleSetting: new URL("../assets/sounds/puzzleSetting.mp3", import.meta.url).href,
};

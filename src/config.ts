import { getCookie } from "./utils/common";
import { Puzzle } from "./utils/puzzle";

export const ASSETS: Record<string, Record<string, any>> = {
    loading: {},
    buttons: {},
    intro: {},
    guide: {},
    study: {},
};

export const clueState = {
    value: {},
    set(value: string) {
        this.value = value;
    },
};

export const studyCompleteState = {
    value: false,
    setComplete() {
        this.value = true;
    },
};

export const soundState = {
    value: true,
    set(value: boolean) {
        this.value = value;
    },
};

export const soundTextState = {
    value: "버튼을 탭하고 소리를 켜세요.",
    update(value: string) {
        this.value = value;
    },
};

export const wordMasterRound = {
    value: "",
    update(round: string) {
        this.value = round;
    },
};
export const puzzle = new Puzzle();
/**
 * cookie setting
 */
export const gameType = getCookie({ name: "game_type" }) ?? "";
export const os = getCookie({ name: "device_os" }) ?? "";
export const serviceSite = getCookie({ name: "service_site" }) ?? "";
export const fcId = getCookie({ name: "fc_id" }) ?? "";
export const fuId = getCookie({ name: "fx7" }) ?? "";
export const deviceType = getCookie({ name: "device_type" }) ?? "";
export const stage = getCookie({ name: "stage" }) ?? "";
export const isTest = getCookie({ name: "is_test" }) ?? "";

export const foxschoolCookies = () => {
    if (serviceSite !== "foxschoool") return {};

    return {
        classCode: getCookie({ name: "class_code" }) ?? "",
        hwCode: getCookie({ name: "hw_code" }) ?? "",
        fgId: getCookie({ name: "fg_id" }) ?? "",
        userType: getCookie({ name: "user_type" }) ?? "",
        schoolName: getCookie({ name: "school_group_id" }) ?? "",
    };
};

export const littlefoxCookies = () => {
    if (serviceSite !== "littlefox") return {};

    let cookiesOb: Record<string, NonNullable<string>> = {
        fuStatus: getCookie({ name: "fu_status" }) ?? "",
        lang: getCookie({ name: "lang" }) ?? "",
        hwNo: getCookie({ name: "hw_no" }) ?? "",
    };

    if (gameType === "word_master") {
        cookiesOb["wordMasterSeq"] = getCookie({ name: "word_master_seq" }) ?? "";
    } else if (gameType === "class") {
        cookiesOb["classId"] = getCookie({ name: "class_id" }) ?? "";
    }

    return cookiesOb;
};

/**
 * update screen size, scale
 */
export const WIDTH = deviceType === "tablet" ? 1920 : 1080;
export const HEIGHT = deviceType === "tablet" ? 1440 : 1920;

export const ScaleState = {
    value: Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT),
    update() {
        this.value = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
    },
};

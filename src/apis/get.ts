import { fcId, foxschoolCookies, fuId, gameType, littlefoxCookies, serviceSite, stage } from "../config";
import { api, handleApi } from "./api";

export const getContentInfo = async () => {
    let res = null;

    if (serviceSite === "foxschool") {
        const { schoolName } = foxschoolCookies();
        const url = `${schoolName}/crossword_h5_api/info/${fcId}/${fuId}`;

        res = await handleApi(api(url));
    } else {
        const { wordMasterSeq, lang } = littlefoxCookies();

        let url = "";

        if (gameType === "word_master") {
            url = `crossword_h5_v2_api/info/${stage}/${wordMasterSeq}/${lang}/${fuId ? fuId : ""}`;
        } else {
            url = `crossword_h5_api/info/${fcId}/${fuId}`;
        }

        res = await handleApi(api(url));
    }

    return res.json();
};

export const getTypingWordXml = async () => {
    let res = null;

    if (serviceSite === "foxschool") {
        const { schoolName } = foxschoolCookies();
        const url = `${schoolName}/crossword_h5_api/view/${fcId}`;

        res = await handleApi(api(url));
    } else {
        if (gameType !== "word_master") {
            let url = `crossword_h5/view/${fcId}`;
            res = await handleApi(api(url));
        }
    }

    return res;
};

export const getTypingWordXml1 = async () => {
    let res = null;

    if (serviceSite !== "foxschool") {
        const { wordMasterSeq, lang } = littlefoxCookies();

        if (gameType === "word_master") {
            let url = `crossword_h5_v2_api/view/${wordMasterSeq}/1/${stage}/${lang}/${fuId ? fuId : ""}`;
            res = await handleApi(api(url));
        }
    }

    return res;
};

export const getTypingWordXml2 = async () => {
    let res = null;

    if (serviceSite !== "foxschool") {
        const { wordMasterSeq, lang } = littlefoxCookies();

        if (gameType === "word_master") {
            let url = `crossword_h5_v2_api/view/${wordMasterSeq}/2/${stage}/${lang}/${fuId ? fuId : ""}`;
            res = await handleApi(api(url));
        }
    }

    return res;
};

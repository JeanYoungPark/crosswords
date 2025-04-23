import { fcId, fuId, gameType, littlefoxCookies, stage } from "../config";
import { api, handleApi } from "./api";

export const postSaveData = async ({ correctNum, totalLength, limitTime }: { correctNum: number; totalLength: number; limitTime: number }) => {
    let res = null;

    const { wordMasterSeq, fuStatus, hwNo, classId, lang } = littlefoxCookies();

    let url = "";

    if (gameType === "word_master") {
        if (fuId) {
            // url = `crossword_h5_v2_api/save/${wordMasterSeq}/${wordMasterSeq}/${correctNum}/${totalLength}/${
            //     totalLength * 30 - limitTime
            // }/${stage}/${fuId}`;
            url = `crossword_h5_v2_api/save/${wordMasterSeq}/${wordMasterSeq}/${correctNum}/${totalLength}/0/${stage}/${fuId}`;
        }
    } else if (gameType === "class") {
        if (fuId) {
            url = `crossword_h5_v2_api/save/${fuId}/${fcId}/${correctNum}/${totalLength}/${fuStatus}/${hwNo}/${classId}`;
        }
    } else {
        if (fuId) {
            url = `crossword_h5_v2_api/save/${fuId}/${fcId}/${correctNum}/${totalLength}/${fuStatus}/${hwNo}/${classId}`;
        }
    }

    res = await handleApi(api(url));
    console.log(res);
    return res.json();
};

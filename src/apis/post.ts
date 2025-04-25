import { fcId, fuId, gameType, littlefoxCookies, stage, wordMasterRound } from "../config";
import { api, handleApi } from "./api";

export const postSaveData = async ({ correctNum, totalLength, leftTime }: { correctNum: number; totalLength: number; leftTime: number }) => {
    let res = null;

    const { wordMasterSeq, fuStatus, hwNo, classId } = littlefoxCookies();

    let url = "";

    if (gameType === "word_master") {
        if (fuId) {
            const round = wordMasterRound.value === "round1" ? 1 : 2;
            url = `crossword_h5_v2_api/save/${wordMasterSeq}/${correctNum}/${totalLength}/${totalLength * 30 - leftTime}/${stage}/${round}/${fuId}`;
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
    return res.json();
};

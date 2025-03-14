import { getCookie } from "./utils/common";

export const gameType = getCookie({ name: "game_type" });
export const os = getCookie({ name: "device_os" });

export const serviceSite = getCookie({ name: "service_site" });
export const fcId = getCookie({ name: "fc_id" });
export const fuId = getCookie({ name: "fx7" });
export const deviceType = getCookie({ name: "device_type" });
export const stage = getCookie({ name: "stage" });

// foxschool
export const foxschoolCookies =
    serviceSite === "foxschool"
        ? {
              classCode: getCookie({ name: "class_code" }),
              hwCode: getCookie({ name: "hw_code" }),
              fgId: getCookie({ name: "fg_id" }),
              userType: getCookie({ name: "user_type" }),
              schoolName: getCookie({ name: "school_group_id" }),
          }
        : null;

export const littlefoxCookies =
    serviceSite === "littlefox"
        ? {
              fuStatus: getCookie({ name: "fu_status" }),
              lang: getCookie({ name: "lang" }),
              hwCode: getCookie({ name: "hw_code" }),
              wordMasterSeq: getCookie({ name: "word_master_seq" }),
          }
        : null;

export const WIDTH = 1080;
export const HEIGHT = 1920;

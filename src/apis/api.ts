import ky from "ky";
import { littlefoxCookies, serviceSite } from "../config";

let url = "";

if (serviceSite === "littlefox") {
    const lang = littlefoxCookies().lang;

    if (lang) {
        url = lang === "kr" ? import.meta.env.VITE_LITTLEFOX_API_URL : `${import.meta.env.VITE_LITTLEFOX_GL_API_URL}${littlefoxCookies().lang}`;
    } else {
        console.log("lang이 존재하지 않습니다.");
    }
} else {
    url = import.meta.env.VITE_FOXSCHOOL_API_URL;
}

export const api = ky.create({
    prefixUrl: url,
});

export const handleApi = async (promise: Promise<any>) => {
    try {
        const response = await promise;
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};

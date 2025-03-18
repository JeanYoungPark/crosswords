import ky from "ky";
import { littlefoxCookies, serviceSite } from "../config";

let url = "";

if (serviceSite === "littlefox") {
    const lang = littlefoxCookies!.lang;

    if (lang) {
        url = lang === "kr" ? import.meta.env.VITE_LITTLEFOX_API_URL : `${import.meta.env.VITE_LITTLEFOX_GL_API_URL}${littlefoxCookies?.lang}`;
    } else {
        throw Error;
    }
} else {
    url = import.meta.env.VITE_FOXSCHOOL_API_URL;
}

export const api = ky.create({
    prefixUrl: url,
});

export const handleApi = async <T>(promise: Promise<T>) => {
    try {
        return await promise;
    } catch (error) {
        console.log(error);
        return null;
    }
};

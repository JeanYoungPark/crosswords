export const getCookie = ({ name }: { name: string }) => {
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : null;
};

export const webviewClose = (device_os: string) => {
    if (device_os == "Android") {
        (window as any).littlefoxJavaInterface.onInterfaceExitView();
    } else {
        (window as any).webkit.messageHandlers.onInterfaceExitView.postMessage("");
    }
};

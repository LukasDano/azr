/**
 * Liest aus den Metadaten der HTML-Datei die Version
 * und den Namen aus und gibt diese in die console aus
 */
function consoleIntro () {
    const versionMeta = document.querySelector("meta[name='Version']");
    const versionNameMeta = document.querySelector("meta[name='VersionName']");

    if (!versionMeta && !versionNameMeta) return;
    console.info(`Arbeitszeitrechner: ${versionMeta.content} - ${versionNameMeta.content}`);
}

/**
 * Loggt die neue URL, wenn die alte noch genutzt wird.
 * Localhost ist komplett ausgenommen.
 */
function informIfUseDeprecated() {
    const url = window.location.href;
    const local = url.includes("localhost");

    if (!local && !url.includes(".io/azr")) {
        const branch = url.includes("main") ? "main" : "bugfix";
        const newUrl = "https://lukasdano.github.io/azr/" + branch;
        const message = "The Link you currently use is deprecated, pls switch to the newer version: "
        console.info(message, newUrl);
    }
}
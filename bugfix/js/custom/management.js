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
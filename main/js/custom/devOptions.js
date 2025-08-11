/**
 * Prüft, ob die DevOptions aktiv sein sollen und stellt die Buttons dann da
 */
function checkForDevOptions() {
    const devOptionStatus = getBooleanCookie("devOptions");
    const displayStyle = devOptionStatus ? "block" : "none";

    document.querySelectorAll(".devOption").forEach((element) => {
        element.style.display = displayStyle;
    });
}

/**
 * Startet die DevOptions
 * (Kann in der Console aufgerufen werden, soll/muss keine usages haben)
 */
function enableDevOptions() {
    setCookie("devOptions", true);
    checkForDevOptions();
}

/**
 * Schließt die DevOptions
 * (Kann in der Konsole aufgerufen werden)
 */
function disableDevOptions() {
    deleteCookie("devOptions");
    checkForDevOptions();
}

/**
 * Öffnet oder schließt die DevOptions je nachdem ob sie offen oder geschlossen sind
 */
function openOrCloseDevOptionsFromButton() {
    const devOptionsEnabled = getBooleanCookie("devOptions");

    if (devOptionsEnabled) {
        disableDevOptions();
        return;
    }

    enableDevOptions();
}

/**
 * Aktiviert die DevOptions, wenn in der URL bestimmte Parameter drinnen sind
 * (Der benötigte Link: "...index.html?param1=devOptions&param2=true")
 */
function activateDevOptionsFromURL() {
    const url = new URL(window.location.href);
    const key = url.searchParams.get("param1");
    const value = url.searchParams.get("param2");
    if (key && value) activateDevMode(url, key, value);
}

/**
 * Aktiviert den DevMode.
 * Löscht die Parameter aus der URL und lädt die Seite neu
 * @param {string} url Die gesamte URL
 * @param {string} key Der Key zu dem der Cookie gesetzt wird
 * @param {string} value Der Wert der in den Cookie gestezt wird
 */
function activateDevMode(url, key, value) {
    setCookieUntilMidnight(key, value);

    url.searchParams.delete("param1");
    url.searchParams.delete("param2");

    window.history.replaceState({}, document.title, url.pathname + url.search);
    window.location.reload();
}

/**
 * Löscht alle Cookies die Zeiten für die Seite speichern
 */
function resetCookies() {
    deleteCookie("todayTimeStamp");
    deleteCookie("modus");
    deleteCookie("float");
    deleteCookie("gleittage");
    deleteCookie("pause");
    deleteCookie("pauseTime");
    deleteCookie("start");

    setCookie("todayTimeStamp", new Date().getTime());
}

/**
 * Startet die Seite komplett neu
 */
function resetPage() {
    resetCookies();
    window.location.reload();
}

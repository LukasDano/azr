/** @import {Time} from ./../../ts/types.ts */

/**
 * Gibt die aktuelle Kalenderwoche zurück
 * @return {number} Die Aktuelle KW
 */
function getCurrentKW() {
    return Math.ceil((((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000) + new Date(new Date().getFullYear(), 0, 1).getDay() + 1) / 7)
}

/**
 * Gibt die Tage des aktuellen Monats aus
 * @return {number} Tage des aktuellen Monats
 */
function getDaysInCurrentMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
}

/**
 * Gibt die aktuelle Zeit als Time Wert aus
 * @return {Time} Die aktuelle Uhrzeit in Stunden und Minuten
 */
function getCurrentTime() {
    return [new Date().getHours(), new Date().getMinutes()];
}

/**
 * Gibt den aktuellen Monat aus
 * @return {number} Die Kalendernummer des aktuellen Monats
 */
function getCurrentMonth() {
    return new Date().getMonth() + 1;
}

/**
 * Welches Jahr hatten wir als es das letzte Mal dieser Monat war
 * @param {number} month Der fragliche Monat
 * @return {number} Das gesuchte Jahr
 */
function getYearForLastTimeMonth(month) {
    const currentYear = new Date().getFullYear();
    const currentMonth = getCurrentMonth();

    if (currentMonth < month) return currentYear - 1;
    return currentYear;
}

/**
 * Welches Jahr haben wir es das nächste Mal dieser Monat ist
 * @param {number} month Der fragliche Monat
 * @return {number} Das Jahr
 */
function getYearForNextTimeMonth(month) {
    const currentYear = new Date().getFullYear();
    const currentMonth = getCurrentMonth();

    if (currentMonth > month) return currentYear + 1;
    return currentYear;
}

/**
 * @return {string[]} Alle deutschen Namen der Monate
 */
function getMonthNamesAsList() {
    return [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
    ];
}

/**
 * @param {Date} date Das zu konvertierende Datum
 * @return {string} Das Datum als validen String
 */
function getValidDateString(date) {
    const correctedMonth = formatNumber(date.getMonth() + 1);
    const correctedDate = formatNumber(date.getDate());
    return date.getFullYear() + "-" + correctedMonth + "-" + correctedDate;
}

/**
 * @param {number} month Der Monat
 * @param {number} year Das Jahr in dem der Monat war
 * @return {number} Wie viele Tage hatte ein Monat in einem bestimmten Jahr?
 */
function getDaysForMonthInYear(month, year) {
    return new Date(year, month, 0).getDate();
}

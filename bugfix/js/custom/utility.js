/** @import {Time} from ./../../ts/types.ts */

/**
 * Vergleicht zwei Time Werte miteinander und gibt den späteren zurück.
 * Wenn, beide übereinstimmen wird der erste timeOne zurückgegeben.
 *
 * @param {Time} timeOne Der erste Zeitpunkt für den Vergleich.
 * @param {Time} timeTwo Der erste Zeitpunkt für den Vergleich.
 * @return {Time} Der später Zeitpunkt/ timeOne, wenn beide gleich sind
 */
function getLaterTime(timeOne, timeTwo) {
    for (let i = 0; i < Math.min(timeOne.length, timeTwo.length); i++) {
        if (timeOne[i] < timeTwo[i]) return timeTwo;
        if (timeOne[i] > timeTwo[i]) return timeOne;
    }

    return timeOne.length >= timeTwo.length ? timeOne : timeTwo;
}

/**
 * Formatiert einen Time value, der zu einem String,
 * bei dem die Minuten immer zweistellig sind
 *
 * @param {Time} time Die Zeit, die formatiert werden soll
 * @return {String} Die Zeit als Formatierter String
 */
function formatTime(time) {
    const [hours, mins] = time;
    const formattedMins = formatNumber(mins);
    return `${hours}.${formattedMins}`;
}

/**
 * Gibt die übergebene Zahl mit einer 0 davor aus, sofern die Zahl einstellig ist
 *
 * @param number Die Zahl
 * @returns {string} Eine schönere Darstellung der Zahl
 */
function formatNumber(number) {
    if (number < 10 && number >= 0) {
        return "0" + number;
    } else {
        return number.toString();
    }
}

/**
 * Konvertiert Minuten in Stunden und Minuten
 *
 * @param {number} minutes Die Minuten, die konvertiert werden sollen
 * @returns {Time} Die Minuten im Time Format
 */
function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes < 0) {
        hours++;
    }

    return [hours, remainingMinutes];
}

/**
 * Addiert zwei Time Values miteinander
 *
 * @param {Time} firstValue
 * @param {Time} secondValue
 * @return {Time} Die Summe der beiden Zahlen
 */
function addTimeValues(firstValue, secondValue) {
    const [oneHours, oneMins] = firstValue;
    const [twoHours, twoMins] = secondValue;

    let sumHours = oneHours + twoHours;
    let sumMins = oneMins + twoMins;

    // Minuten in Stunden umwandeln, falls >= 60
    if (sumMins >= 60) {
        sumHours += Math.floor(sumMins / 60);
        sumMins = sumMins % 60;
    }

    return [sumHours, sumMins];
}


/**
 * Zieht zwei Time Values voneinander ab
 *
 * @param {Time} minuend Die Zahl von der etwas abgezogen wird
 * @param {Time} subtrahend Die Zahl, zu der etwas addiert wird
 * @return {Time} Die Differnz der beiden Zeiten
 */
function subtractTimeValues(minuend, subtrahend) {
    const totalMinuend = minuend[0] * 60 + minuend[1];
    const totalSubtrahend = subtrahend[0] * 60 + subtrahend[1];

    const diffInMinutes = totalMinuend - totalSubtrahend;

    const hours = Math.trunc(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return [hours, minutes];
}

/**
 * Prüft, ob ein Time Value unter 0 ist.
 * Wenn der Wert nicht unter 0 ist, wird die Zeit einfach wieder zurückgegeben.
 * Wenn der Wert unter 0 ist, wird der Wert für 0 Stunden und 0 Minuten zurückgegeben.
 *
 * @param {Time} time Die Zeit, die geprüft werden soll
 * @returns {Time} "time" oder 0 Stunden und 0 Minuten
 */
function checkIfTimeIsBelowZero(time) {
    const [hours, mins] = time;

    if (hours < 0 || mins < 0) {
        return [0, 0]
    }

    return time;
}

/**
 * Generiert aus Array mit zwei string Werten einen Time Value
 *
 * @param {[string, string]} timeAsString Der Time Value aber mit Strings
 * @returns {Time}
 */
function timeFromStringArray(timeAsString) {
    const [hoursString, minutesString] = timeAsString;
    const hours = parseInt(hoursString, 10);
    const minutes = parseInt(minutesString, 10);

    return [hours, minutes];
}

/**
 * Erzeugt aus dem keyboardControl Value die Action und Condition
 * Wenn keine condition vorhanden ist, wird "-" gesetzt
 *
 * @param {string} value Der value aus keyboardControl
 * @returns {[string, string]} [action, condition]
 */
function generateActionAndShortcut(value) {
    let action = value;
    let condition = "-";

    let match = value.match(/^([^(]+)\s*\(([^)]+)\)/);
    if (match) {
        action = match[1].trim();
        condition = match[2].trim();
    }

    return [action, condition];
}

module.exports = {
    getLaterTime,
    formatTime,
    formatNumber,
    minutesToTime,
    addTimeValues,
    subtractTimeValues,
    checkIfTimeIsBelowZero,
    timeFromStringArray
};

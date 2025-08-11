/** @import {Time, DayTime, WeekTime} from ./../../ts/types.ts */

/**
 * Liefert die Arbeitszeit für die Woche
 *
 * @param {WeekTime} weekTime Ein Objekt mit "hours" und "mins" Werten für jeden Wochentag
 * @returns {Time} Die komplette Arbeitszeit in Stunden und Minuten
 */
function getWeekWorkTime(weekTime) {
    let totalHours = 0;
    let totalMins = 0;

    for (const day in weekTime) {
        if (weekTime.hasOwnProperty(day)) {
            totalHours += weekTime[day].hours;
            totalMins += weekTime[day].mins;
        }
    }

    totalHours += Math.floor(totalMins / 60);
    totalMins = totalMins % 60;

    return [totalHours, totalMins];
}

/**
 * Rechnet die Gleitzeit für diese Woche aus (Kann nicht getestet werden)
 *
 * @param {Time} weekWorkTime Gesamt Arbeitszeit einer Woche
 * @returns {Time} Die Überstunden der gesamten Woche in Stunden und Minuten
 */
function calculateWeekOverTime(weekWorkTime) {
    const [sollHours, sollMins] = [35, 30];
    const [workHours, workMins] = weekWorkTime;

    const totalWorkMinutes = workHours * 60 + workMins;
    const totalSollMinutes = sollHours * 60 + sollMins;

    let diff = totalWorkMinutes - totalSollMinutes;

    const overtimeHours = Math.trunc(diff / 60);
    const overtimeMins = diff % 60;

    if (overtimeMins < 0) {
        return [overtimeHours - 1, overtimeMins + 60];
    } else {
        return [overtimeHours, overtimeMins];
    }
}

/**
 * Formatiert die Arbeitszeit der Woche
 *
 * @param {Time} weekTime Die Arbeitszeit der Woche
 * @param {boolean} [testCase=false] Wird die funktion im test ausgeführt?
 *
 * @return {string} Arbeitszeit als lesbarer String
 */
function formatWeekTime(weekTime, testCase = false) {
    let [weekHours, weekMins] = weekTime;
    let weekTimeAusgabe;

    if (weekHours <= 9 && weekHours > 0) {
        weekHours = "0" + weekHours;
    }

    if (weekMins <= 9 && weekHours > 0 && weekMins >= 0) {
        weekMins = "0" + weekMins;
    }

    if (weekHours && weekMins) {
        weekHours = Math.abs(weekHours);
        weekMins = Math.abs(weekMins);

        if (!testCase) {
            weekTimeAusgabe = weekHours + "." + formatNumber(weekMins) + " h";
        }

        if (weekMins < 10 && weekMins >= 0) {
            weekMins = "0" + weekMins;
        } else {
            weekMins = weekMins.toString();
        }

        weekTimeAusgabe = weekHours + "." + weekMins + " h";

    } else {
        weekTimeAusgabe = "0.0 h";
    }

    return weekTimeAusgabe;
}

/**
 * Formatiert die Arbeits- bzw. die Gleitzeit der Woche
 *
 * @param {Time} weekOverTime Die Gleitzeit der Woche
 *
 * @return {string} Gleitzeit als lesbarer String
 */
function formatWeekOverTime(weekOverTime) {
    let [weekOverTimeHours, weekOverTimeMins] = weekOverTime;
    let weekOverTimeAusgabe;

    if (weekOverTimeHours <= 9 && weekOverTimeHours > 0) {
        weekOverTimeHours = "0" + weekOverTimeHours;
    }

    if (weekOverTimeMins <= 9 && weekOverTimeHours > 0) {
        weekOverTimeMins = "0" + weekOverTimeMins;
    }

    if (weekOverTimeHours < 0 || weekOverTimeMins < 0) {
        weekOverTimeHours = Math.abs(weekOverTimeHours);
        weekOverTimeMins = Math.abs(weekOverTimeMins);

        weekOverTimeAusgabe = "-" + weekOverTimeHours + "." + weekOverTimeMins + " h";
    } else if (weekOverTimeHours > 0 || weekOverTimeMins > 0) {
        weekOverTimeAusgabe = "+" + weekOverTimeHours + "." + weekOverTimeMins + " h";
    } else {
        weekOverTimeAusgabe = "0.0 h";
    }

    return weekOverTimeAusgabe;
}

/**
 * Gibt die Zeiten eines Tages zurück
 *
 * @param {string} day ElementID eines Tages Feldes
 * @return {DayTime} Die Arbeitszeiten eines Tages
 */
function getTimeForDay(day) {
    const [hours, mins] = getDayFieldValue(day).toString().split(":").map((time) => parseInt(time, 10));
    return { hours, mins };
}

/**
 * Gibt die Arbeitszeiten der gesamten Woche zurück
 *
 * @return {WeekTime} Die Arbeitszeiten jedes Wochentages zusammengefasst
 */
function getTimeForWeek() {
    return {
        monday: getTimeForDay("monday"),
        tuesday: getTimeForDay("tuesday"),
        wednesday: getTimeForDay("wednesday"),
        thursday: getTimeForDay("thursday"),
        friday: getTimeForDay("friday"),
    };
}

module.exports = {
    getWeekWorkTime,
    calculateWeekOverTime,
    formatWeekTime,
    formatWeekOverTime,
};

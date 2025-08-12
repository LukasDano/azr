/** @import {FeiertageHamburg, Time} from ./../../ts/types.ts */

/**
 * Berechnet das Osterdatum zu einem gegebenen Jahr
 *
 * @param {number} year Das Jahr zu in dem man das Osterdatum wissen will
 * @returns {Date} Das Osterdatum
 */
function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Berechnet das Osterdatum zu einem gegebenen Jahr
 *
 * @param {number} year Das Jahr in dem man die Feiertage wissen will
 * @returns {FeiertageHamburg} Ein Objekt mit den Feiertagen
 */
function getHamburgHolidays(year) {

    const easterDate = getEasterDate(year);
    const holidays = {
        "Neujahr": new Date(Date.UTC(year, 0, 1)),
        "Karfreitag": new Date(easterDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        "Ostermontag": new Date(easterDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        "Tag der Arbeit": new Date(Date.UTC(year, 4, 1)),
        "Christi Himmelfahrt": new Date(easterDate.getTime() + 39 * 24 * 60 * 60 * 1000),
        "Pfingstmontag": new Date(easterDate.getTime() + 50 * 24 * 60 * 60 * 1000),
        "Tag der Deutschen Einheit": new Date(Date.UTC(year, 9, 3)),
        "Reformationstag": new Date(Date.UTC(year, 9, 31)),
        "Heiligabend": new Date(Date.UTC(year, 11, 24)),
        "1. Weihnachtstag": new Date(Date.UTC(year, 11, 25)),
        "2. Weihnachtstag": new Date(Date.UTC(year, 11, 26)),
        "Silvester": new Date(Date.UTC(year, 11, 31))
    };

    // Formatiere die Daten als Strings im Format "YYYY-MM-DD"
    for (let holiday in holidays) {
        holidays[holiday] = holidays[holiday].toISOString().split('T')[0];
    }

    return holidays;
}

/**
 * Berechnet die Anzahl der Arbeitstage für den aktuellen Monat
 *
 * @deprecated Vlt. kann doch die andere Funktion mit der API genutzt werden?!
 *
 * @param {number} month Monat für den gerechnet werden soll
 * @param {number} year Jahr für das gerechnet werden soll
 * @returns {number} Die Anzahl der Arbeitstage für den aktuellen Monat
 */
function getWorkDaysInMonthOffline(month, year) {
    const lastDay = new Date(year, month, 0).getDate();

    const holidays = getHamburgHolidays(year);
    const holidayDates = new Set(Object.values(holidays));

    let workDays = 0;

    for (let day = 1; day <= lastDay; day++) {
        if (isWorkDay(day, month, year, holidayDates)) {
            workDays++;
        }
    }
    return workDays;
}

/**
 * Prüft, ob ein übergebenes Datum ein Arbeitstag ist
 *
 * @param {number} day Das Tages Datum
 * @param {number} month Der Monat
 * @param {number} year Das Jahr
 * @param {Set} holidayDates Feiertage des jeweiligen Monats
 * @return {boolean}
 */
function isWorkDay(day, month, year, holidayDates) {
    const correctJSDateMonth = month - 1;
    const date = new Date(year, correctJSDateMonth, day);
    const dayOfWeek = date.getDay();
    const dateString = getValidDateString(date);
    const dayIsNotOnWeekend = dayOfWeek !== 0 && dayOfWeek !== 6

    if (dayIsNotOnWeekend && !holidayDates.has(dateString)) {
        return true;
    }
}

/**
 * Gibt zusätzliche gewünschte Feiertage zurück
 *
 * @param {number} year Das Jahr in dem die Feiertage stattfinden
 * @return Ein Objekt mit allen hinterlegten Feiertagen
 */
function getAdditionalHolidays(year) {
    return {
        "Heiligabend": new Date(Date.UTC(year, 11, 24)),
        "Silvester": new Date(Date.UTC(year, 11, 31))
    };
}

/**
 * Liefert die Anzahl der Arbeitstage des laufenden Monats
 *
 * @param {number} month Monat für den gerechnet werden soll
 * @param {number} year Jahr für das gerechnet werden soll
 * @returns {Promise<number>} Arbeitstage des aktuellen Monats
 */
async function getWorkDaysInMonthFromAPI(month, year) {
    const lastDay = new Date(year, month, 0).getDate();
    const additionalHolidays = getAdditionalHolidays(year);
    let workDays = 0;

    const publicHolidaysUrl = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&subdivisionCode=DE-HH&validFrom=${year}-${month}-01&validTo=${year}-${month}-${lastDay}`;

    try {
        const response = await fetch(publicHolidaysUrl);
        const publicHolidays = await response.json();

        const holidayDates = new Set(publicHolidays.map(h => h.startDate.split('T')[0]));

        for (const holidayName in additionalHolidays) {
            const holidayDate = additionalHolidays[holidayName];
            const holidayDateString = holidayDate.toISOString().split('T')[0];
            holidayDates.add(holidayDateString);
        }

        for (let day = 1; day <= lastDay; day++) {
            if (isWorkDay(day, month, year, holidayDates)) {
                workDays++;
            }
        }
    } catch (error) {
        console.error('Error fetching holiday data:', error);
        return getWorkDaysInMonthOffline(month, year);
    }

    return workDays;
}

/**
 * Rechnet in Prozent den Anteil vom "flexTime" an "workTimeMonth"
 *
 * @param {Time} flexTime Die Arbeitszeit, die diesen Monat im Flex office erbracht wurde
 * @param {Time} workTimeMonth Die gesamte Arbeitszeit, die diesen Monat erbracht werden muss
 * @returns {number} Den prozentualen Anteil der Zeit im Flex office
 */
function calculatePercentage(flexTime, workTimeMonth) {
    const flexTimeMinutes = flexTime[0] * 60 + flexTime[1];
    const workTimeMonthMinutes = workTimeMonth[0] * 60 + workTimeMonth[1];

    return (flexTimeMinutes / workTimeMonthMinutes) * 100;
}

/**
 * Berechnet die Arbeitszeit, die diesen Monat noch erbracht werden kann,
 * bis die maximalen Prozent erreicht werden
 *
 * @param {number} currentPercentage Die bereits erbrachten Prozent
 * @param {number} targetPercentage Die maximalen Prozent
 * @param {Time} workTimeMonth Die zu erbringende Arbeitszeit im Monat
 * @returns {Time} Die Zeit, die noch aus dem Flex office erbracht werden kann
 */
function timeLeftToReachPercentage(currentPercentage, targetPercentage, workTimeMonth) {
    const workTimeMonthMinutes = workTimeMonth[0] * 60 + workTimeMonth[1];
    const currentMinutes = (workTimeMonthMinutes * currentPercentage) / 100;
    const targetMinutes = (workTimeMonthMinutes * targetPercentage) / 100;

    const remainingMinutes = Math.max(0, targetMinutes - currentMinutes);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMinutesLeft = Math.round(remainingMinutes % 60);

    return [remainingHours, remainingMinutesLeft];
}

/**
 *  Gibt die Arbeitszeit, die diesen Monat erbracht werden muss zurück
 *
 * @param {number} daysOff Tage die diesen Monat nicht gearbeitet wurde
 * @param {number} month Monat für den gerechnet werden soll
 * @param {number} year Jahr für das gerechnet werden soll
 * @returns {Promise<Time>} Arbeitszeit des aktuellen Monats
 */
async function getWorkTimePerMonth(daysOff, month, year) {
    const [workHoursTimePerDay, workMinsTimePerDay] = [7, 6];
    const workDaysInCurrentMonth = await getWorkDaysInMonthFromAPI(month, year);

    const countingDaysForCurrentMonth = workDaysInCurrentMonth - daysOff
    let workHours = workHoursTimePerDay * countingDaysForCurrentMonth;
    const workMins = workMinsTimePerDay * countingDaysForCurrentMonth;

    const [hoursFromMinutes, remainingMinutes] = minutesToTime(workMins);
    workHours = workHours + hoursFromMinutes;

    return [workHours, remainingMinutes];
}

/**
 * Die Arbeitszeit, die diesen Monat noch im Flex office erbracht werden darf
 *
 * @param {number} daysOff Tage die diesen Monat nicht gearbeitet wurde
 * @param {Time} flexTime Zeit die diesen Monat schon im Flex office gearbeitet wurde
 * @param {number} flexOfficeQuote Die maximale Quote, die im Flex office gearbeitet werden darf
 * @param {number} month Monat für den gerechnet werden soll
 * @param {number} year Jahr für das gerechnet werden soll
 * @returns {Promise<Time>} Die restliche Flex office Arbeitszeit diesen Monat
 */
async function calculateFlexOfficeStats(daysOff, flexTime, flexOfficeQuote, month, year) {
    const workTimeMonth = await getWorkTimePerMonth(daysOff, month, year);
    const percent = calculatePercentage(flexTime, workTimeMonth);
    return timeLeftToReachPercentage(percent, flexOfficeQuote, workTimeMonth);
}

/**
 * Wenn der Monat dieser oder einer der nächsten 5 ist, wird das Jahr für das nächste Mal gesucht,
 * ist der Monat in den letzten 6 enthalten ist, wird das Jahr vom letzten Mal ausgegeben.
 *
 * @param {number} month Der Monat zu dem das Jahr gesucht ist
 * @return {number} Das Jahr
 */
function getYearForMonthWithSixMonthRange(month) {
    const currentMonth = getCurrentMonth();

    let nextSixMonths = [];
    let lastSixMonths = [];

    for (let i = 0; i <= 5; i++) {

        if (currentMonth + i > 11) {
            nextSixMonths.push((currentMonth + i) - 12);
        }

        nextSixMonths.push(currentMonth + i);
    }

    for (let i = 6; i > -1; i--) {
        let lastMonth = currentMonth - i;

        if (lastMonth < 1) {
            lastMonth += 12;
        }

        lastSixMonths.push(lastMonth);
    }

    if (nextSixMonths.includes(month)) {
        return getYearForNextTimeMonth(month);
    }

    if (lastSixMonths.includes(month)) {
        return getYearForLastTimeMonth(month);
    }
}

/**
 * Die Funktion testet "getYearForMonthWithSixMonthRange" mit allen 12 Monaten durch.
 * Durch den Aufbau der Funktion, werden immer die letzten 6, der aktuelle und die nächsten 5 Monate verwendet.
 * @deprecated
 */
function testGetYearForMonthWithSixMonthRangeWithCurrentMonthRange() {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    months.forEach(month => console.log("Der Monat: " + month + "hat folgenden Wert ergeben: " + getYearForMonthWithSixMonthRange(month)));
}

module.exports = {
    calculatePercentage,
    timeLeftToReachPercentage
};

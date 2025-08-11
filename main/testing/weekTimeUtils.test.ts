import {Time, WeekTime} from "../ts/types";
import {getWeekWorkTime,
    calculateWeekOverTime,
    formatWeekTime,
    formatWeekOverTime} from "../js/custom/weekTimeUtils";

describe("getWeekWorkTime", () => {
    test("correct with normal default work hours for each day", () => {
        const weekTime: WeekTime = {
            monday: { hours: 7, mins: 10 },
            tuesday: { hours: 7, mins: 10 },
            wednesday: { hours: 7, mins: 10 },
            thursday: { hours: 7, mins: 10 },
            friday: { hours: 7, mins: 10 },
        };
        const result: Time = getWeekWorkTime(weekTime);
        expect(result).toEqual([35, 50]);
    });

    test("correct with a realistic week", () => {
        const weekTime= {
            monday: { hours: 7, mins: 15 },
            tuesday: { hours: 7, mins: 20 },
            wednesday: { hours: 7, mins: 45 },
            thursday: { hours: 8, mins: 0 },
            friday: { hours: 6, mins: 5 },
        };
        const result: Time = getWeekWorkTime(weekTime);
        expect(result).toEqual([36, 25]);
    });
});

describe("calculateWeekOverTime", () => {
    test("correct with normal default values", () => {
        const weekTime: Time = [35, 50];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([0, 20]);
    });

    test("correct with a realistic week", () => {
        const weekTime: Time = [36, 25];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([0, 55]);
    });

    test("correct with negativ values", () => {
        const weekTime: Time = [27, 30];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([-8, -0]);
    });

    test("correct with positive hours and negative minutes", () => {
        const weekTime: Time = [36, 0];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([0, 30]);
    });

    test("correct with negative hours and positive minutes", () => {
        const weekTime: Time = [34, 45];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([-1, 15]);
    });
});

describe("formatWeekTime", () => {
    const testCase = true;

    test("default values", () => {
        const weekTime: Time = [35, 30];
        const result = formatWeekTime(weekTime, testCase);
        expect(result).toEqual("35.30 h");
    });

    test("with values under 10", () => {
        const weekTime: Time = [7, 6];
        const result = formatWeekTime(weekTime, testCase);
        expect(result).toEqual("7.06 h");
    });

    test("with one value under 10", () => {
        const weekTime: Time = [14, 6];
        const result = formatWeekTime(weekTime, testCase);
        expect(result).toEqual("14.06 h");
    });

    test("with the other value under 10", () => {
        const weekTime: Time = [7, 12];
        const result = formatWeekTime(weekTime, testCase);
        expect(result).toEqual("7.12 h");
    });

});

describe("formatWeekOverTime", () => {
    test("correct with positiv values", () => {
        const weekTime: Time = [0, 20];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("+0.20 h");
    });

    test("correct with negativ values", () => {
        const weekTime: Time = [-1, -20];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("-1.20 h");
    });

    test("correct with negativ hours", () => {
        const weekTime: Time = [-1, 0];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("-1.0 h");
    });

    test("correct with negativ minutes", () => {
        const weekTime: Time = [0, -20];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("-0.20 h");
    });
});
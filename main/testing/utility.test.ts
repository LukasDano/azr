import { Time } from "../ts/types";
import {
    getLaterTime,
    formatTime,
    formatNumber,
    minutesToTime,
    addTimeValues,
    subtractTimeValues,
    checkIfTimeIsBelowZero,
    timeFromStringArray
} from "../js/custom/utility";

describe("getLaterTime", () => {

    test("correct with timeTwo beeing bigger", () => {
        const timeOne: Time = [12, 21];
        const timeTwo: Time = [14, 51];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeTwo);
    });

    test("correct with timeOne beeing bigger", () => {
        const timeOne: Time = [15, 1];
        const timeTwo: Time = [14, 51];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeOne);
    });

    test("correct with timeOne and timeTwo beeing equal", () => {
        const timeOne: Time = [13, 20];
        const timeTwo: Time = [13, 20];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeOne);
    });
});

describe("formatTime", () => {
    test("correct when less then 10 mins", () => {
        const time: Time = [7, 6];
        const result = formatTime(time);
        expect(result).toEqual("7.06");
    });

    test("correct when more then 10 mins", () => {
        const time: Time = [7, 36];
        const result = formatTime(time);
        expect(result).toEqual("7.36");
    });
});

describe("formatNumber", () => {
    test("return correct with less than 10", () => {
        const mins = 4;
        const result = formatNumber(mins);
        expect(result).toEqual("04");
    });

    test("return correct with more than 10", () => {
        const mins = 12;
        const result = formatNumber(mins);
        expect(result).toEqual("12");
    });

    test("return correct with broder value", () => {
        const mins = 9;
        const result = formatNumber(mins);
        expect(result).toEqual("09");
    });

    test("with a 0", () => {
        const mins = 0;
        const result = formatNumber(mins);
        expect(result).toEqual("00");
    });
});

describe("minutesToTime", () => {
    test("more than 60", () => {
        const minutes = 108;
        const result = minutesToTime(minutes);
        expect(result).toEqual([1, 48]);
    });

    test("exactly 60", () => {
        const minutes = 60;
        const result = minutesToTime(minutes);
        expect(result).toEqual([1, 0]);
    });

    test("less than 60", () => {
        const minutes = 42;
        const result = minutesToTime(minutes);
        expect(result).toEqual([0, 42]);
    });

    test("exactly 120", () => {
        const minutes = 120;
        const result = minutesToTime(minutes);
        expect(result).toEqual([2, 0]);
    });

    test("neagtiv under one hour", () => {
        const minutes = -1;
        const result = minutesToTime(minutes);
        expect(result).toEqual([0, -1]);
    });

    test("neagtiv more then an hour", () => {
        const minutes = -108;
        const result = minutesToTime(minutes);
        expect(result).toEqual([-1, -48]);
    });

    test("neagtiv an hour", () => {
        const minutes = -60;
        const result = minutesToTime(minutes);
        expect(result).toEqual([-1, -0]);
    });

    test("neagtiv two hours", () => {
        const minutes = -120;
        const result = minutesToTime(minutes);
        expect(result).toEqual([-2, -0]);
    });
});

describe("addTimeValues", () => {
    test("default", () => {
        const firstTime: Time = [8, 25];
        const secondTime: Time = [6, 0];
        const result = addTimeValues(firstTime, secondTime);
        expect(result).toEqual([14, 25]);
    });

    test("both zero", () => {
        const firstTime: Time = [0, 0];
        const secondTime: Time = [0, 0];
        const result = addTimeValues(firstTime, secondTime);
        expect(result).toEqual([0, 0]);
    });

    test("Minuten ergeben genau eine Stunde", () => {
        const firstTime: Time = [2, 30];
        const secondTime: Time = [3, 30];
        const result = addTimeValues(firstTime, secondTime);
        // 2:30 + 3:30 = 5:60 = 6:00
        expect(result).toEqual([6, 0]);
    });

    test("Minuten ergeben mehr als eine Stunde", () => {
        const firstTime: Time = [1, 50];
        const secondTime: Time = [2, 45];
        const result = addTimeValues(firstTime, secondTime);
        // 1:50 + 2:45 = 3:95 = 4:35
        expect(result).toEqual([4, 35]);
    });

    test("Addition mit führenden Nullen", () => {
        const firstTime: Time = [0, 5];
        const secondTime: Time = [0, 55];
        const result = addTimeValues(firstTime, secondTime);
        // 0:5 + 0:55 = 0:60 = 1:00
        expect(result).toEqual([1, 0]);
    });

    test("Addition mit großen Zahlen", () => {
        const firstTime: Time = [12, 45];
        const secondTime: Time = [15, 30];
        const result = addTimeValues(firstTime, secondTime);
        // 12:45 + 15:30 = 28:15
        expect(result).toEqual([28, 15]);
    });
});


describe("subtractTimeValues", () => {
    test("first one bigger", () => {
        const minuend: Time = [12, 30];
        const subtrahend: Time = [10, 25];
        const result = subtractTimeValues(minuend, subtrahend);
        expect(result).toEqual([2, 5]);
    });

    test("second one bigger", () => {
        const minuend: Time = [12, 30];
        const subtrahend: Time = [15, 45];
        const result = subtractTimeValues(minuend, subtrahend);
        expect(result).toEqual([-3, -15]);
    });

    test("both same value", () => {
        const minuend: Time = [12, 30];
        const subtrahend: Time = [12, 30];
        const result = subtractTimeValues(minuend, subtrahend);
        expect(result).toEqual([0, 0]);
    });

    test("Minuend Minuten kleiner als Subtrahend Minuten (Übertrag notwendig)", () => {
        const minuend: Time = [10, 10];
        const subtrahend: Time = [8, 45];
        const result = subtractTimeValues(minuend, subtrahend);
        // Erwartet: 10:10 - 8:45 = 1:25 (weil 10-45 = -35, also 1 Stunde weniger, 60-35=25 Minuten)
        expect(result).toEqual([1, 25]);
    });

    test("Minuend Minuten gleich Subtrahend Minuten", () => {
        const minuend: Time = [14, 15];
        const subtrahend: Time = [10, 15];
        const result = subtractTimeValues(minuend, subtrahend);
        expect(result).toEqual([4, 0]);
    });

    test("Minuend ist Mitternacht, Subtrahend nicht", () => {
        const minuend: Time = [0, 0];
        const subtrahend: Time = [3, 20];
        const result = subtractTimeValues(minuend, subtrahend);
        expect(result).toEqual([-3, -20]);
    });

    test("Minuend und Subtrahend sind beide Mitternacht", () => {
        const minuend: Time = [0, 0];
        const subtrahend: Time = [0, 0];
        const result = subtractTimeValues(minuend, subtrahend);
        expect(result).toEqual([0, 0]);
    });
});


describe("checkIfTimeIsBelowZero", () => {
    test("default", () => {
        const time: Time = [7, 50];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([7, 50]);
    });

    test("einstellige Minuten", () => {
        const time: Time = [7, 6];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([7, 6]);
    });

    test("0h, 0m", () => {
        const time: Time = [0, 0];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });

    test("minus Stunden", () => {
        const time: Time = [-1, 0];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });

    test("minus Minuten", () => {
        const time: Time = [0, -14];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });

    test("minus Stunden und Minuten", () => {
        const time: Time = [-1, -14];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });

});

describe("timeFromStringArray", () => {
    test("default", () => {
        const time: [string, string] = ["7", "50"];
        const result = timeFromStringArray(time);
        expect(result).toEqual([7, 50]);
    });

    test("leading zeros", () => {
        const time: [string, string] = ["09", "05"];
        const result = timeFromStringArray(time);
        expect(result).toEqual([9, 5]);
    });

    test("both values above 10", () => {
        const time: [string, string] = ["12", "30"];
        const result = timeFromStringArray(time);
        expect(result).toEqual([12, 30]);
    });

    test("double zeros for both", () => {
        const time: [string, string] = ["00", "00"];
        const result = timeFromStringArray(time);
        expect(result).toEqual([0, 0]);
    });

});
// The MIT License (MIT)
// Copyright (c) <year> <copyright holders>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export class DateFormatter {

    private static DATETIME_FORMATS: any = {
        "AMPMS": [
            "AM",
            "PM"
        ],
        "DAY": [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        "ERANAMES": [
            "Before Christ",
            "Anno Domini"
        ],
        "ERAS": [
            "BC",
            "AD"
        ],
        "FIRSTDAYOFWEEK": 6,
        "MONTH": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "SHORTDAY": [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ],
        "SHORTMONTH": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],
        "STANDALONEMONTH": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "WEEKENDRANGE": [
            5,
            6
        ],
        "fullDate": "EEEE, d MMMM y",
        "longDate": "d MMMM y",
        "medium": "d MMM y h:mm:ss a",
        "mediumDate": "d MMM y",
        "mediumTime": "h:mm:ss a",
        "short": "dd/MM/y h:mm a",
        "shortDate": "dd/MM/y",
        "shortTime": "h:mm a"
    };

    private static DATE_FORMATS: any = {
        yyyy: dateGetter("FullYear", 4, 0, false, true),
        yy: dateGetter("FullYear", 2, 0, true, true),
        y: dateGetter("FullYear", 1, 0, false, true),
        MMMM: dateStrGetter("Month"),
        MMM: dateStrGetter("Month", true),
        MM: dateGetter("Month", 2, 1),
        M: dateGetter("Month", 1, 1),
        LLLL: dateStrGetter("Month", false, true),
        dd: dateGetter("Date", 2),
        d: dateGetter("Date", 1),
        HH: dateGetter("Hours", 2),
        H: dateGetter("Hours", 1),
        hh: dateGetter("Hours", 2, -12),
        h: dateGetter("Hours", 1, -12),
        mm: dateGetter("Minutes", 2),
        m: dateGetter("Minutes", 1),
        ss: dateGetter("Seconds", 2),
        s: dateGetter("Seconds", 1),
        // while ISO 8601 requires fractions to be prefixed with `.` or `,`
        // we can be just safely rely on using `sss` since we currently don"t support single or two digit fractions
        sss: dateGetter("Milliseconds", 3),
        EEEE: dateStrGetter("Day"),
        EEE: dateStrGetter("Day", true),
        a: ampmGetter,
        Z: timeZoneGetter,
        ww: weekGetter(2),
        w: weekGetter(1),
        G: eraGetter,
        GG: eraGetter,
        GGG: eraGetter,
        GGGG: longEraGetter
    };

    private static DATE_FORMATS_SPLIT: any = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/;
    private static NUMBER_STRING: any = /^\-?\d+$/;

    public static parse (date: string): Date {
        return new Date(date);
    }

    public static toDate (date: any): Date {
        if (date instanceof Date) {
            return date;
        }
        return date ? new Date(date) : date;
    }

    public static format (date: any, format: string): string {
        let text: string = "",
            parts: string[] = [],
            fn: any,
            match: boolean;

        format = format || "mediumDate";

        if (isString(date)) {
            date = DateFormatter.NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
        }

        if (isNumber(date)) {
            date = new Date(date);
        }
        if (!isDate(date) || !isFinite(date.getTime())) {
            return date;
        }

        while (format) {
            match = DateFormatter.DATE_FORMATS_SPLIT.exec(format);
            if (match) {
                parts = concat(parts, match, 1);
                format = parts.pop();
            } else {
                parts.push(format);
                format = null;
            }
        }

        forEach(parts, function (value: any): any {
            fn = DateFormatter.DATE_FORMATS[value];
            text += fn ? fn(date, DateFormatter.DATETIME_FORMATS)
                : value === "''" ? "'" : value.replace(/(^'|'$)/g, "").replace(/''/g, "'");
        });
        return text;
    }
}

let ZERO_CHAR: string = "0";
let R_ISO8601_STR: any = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
// 1        2       3         4          5          6          7          8  9     10      11

function dateGetter (name: any, size: any, offset: any = 0, trim?: any, negWrap?: any): any {
    return function (date: any): string {
        let value: any = date["get" + name]();
        if (offset > 0 || value > -offset) {
            value += offset;
        }
        if (value === 0 && offset === -12) value = 12;
        return padNumber(value, size, trim, negWrap);
    };
}

function dateStrGetter (name: any, shortForm?: any, standAlone?: any): any {
    return function (date: any, formats: any): string {
        let value: any = date["get" + name]();
        let propPrefix: any = (standAlone ? "STANDALONE" : "") + (shortForm ? "SHORT" : "");
        let get: any = uppercase(propPrefix + name);
        return formats[get][value];
    };
}

function uppercase (value: any): string {
    return isString(value) ? value.toUpperCase() : value;
}

function isString (value: any): boolean {
    return typeof value === "string";
}

function ampmGetter (date: any, formats: any): any {
    return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

function timeZoneGetter (date: any, formats: any, offset: any): any {
    let zone: any = -1 * offset;
    let paddedZone: any = (zone >= 0) ? "+" : "";

    paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) +
        padNumber(Math.abs(zone % 60), 2);

    return paddedZone;
}

function weekGetter (size: any): any {
    return function (date: any): any {
        let firstThurs: any = getFirstThursdayOfYear(date.getFullYear()),
            thisThurs: any = getThursdayThisWeek(date);

        let diff: any = +thisThurs - +firstThurs,
            result: any = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week

        return padNumber(result, size);
    };
}

function getFirstThursdayOfYear (year: any): any {
    // 0 = index of January
    let dayOfWeekOnFirst: any = (new Date(year, 0, 1)).getDay();
    // 4 = index of Thursday (+1 to account for 1st = 5)
    // 11 = index of *next* Thursday (+1 account for 1st = 12)
    return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
}

function getThursdayThisWeek (datetime: any): any {
    return new Date(datetime.getFullYear(), datetime.getMonth(),
        // 4 = index of Thursday
        datetime.getDate() + (4 - datetime.getDay()));
}

function eraGetter (date: any, formats: any): any {
    return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
}

function longEraGetter (date: any, formats: any): any {
    return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
}

function padNumber (num: any, digits: any, trim ?: any, negWrap?: any): string {
    let neg: string = "";
    if (num < 0 || (negWrap && num <= 0)) {
        if (negWrap) {
            num = -num + 1;
        } else {
            num = -num;
            neg = "-";
        }
    }
    num = "" + num;
    while (num.length < digits) num = ZERO_CHAR + num;
    if (trim) {
        num = num.substr(num.length - digits);
    }
    return neg + num;
}

function jsonStringToDate (value: any): any {
    let match: boolean = value.match(R_ISO8601_STR);
    if (match) {
        let date: Date = new Date(0),
            tzHour: number = 0,
            tzMin: number = 0,
            dateSetter: any = match[8] ? date.setUTCFullYear : date.setFullYear,
            timeSetter: any = match[8] ? date.setUTCHours : date.setHours;

        if (match[9]) {
            tzHour = toInt(match[9] + match[10]);
            tzMin = toInt(match[9] + match[11]);
        }
        dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
        let h: number = toInt(match[4] || 0) - tzHour;
        let m: number = toInt(match[5] || 0) - tzMin;
        let s: number = toInt(match[6] || 0);
        let ms: number = Math.round(parseFloat("0." + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
    }
    return value;
}

function isNumber (value: any): boolean {
    return typeof value === "number";
}

function isDate (value: any): boolean {
    return toString.call(value) === "[object Date]";
}

function toInt (str: any): any {
    return parseInt(str, 10);
}

function concat (array1: any, array2: any, index: any): any {
    return array1.concat(array2.slice(index));
}

function isFunction (value: any): boolean {
    return typeof value === "function";
}

let isArray: any = Array.isArray;

function forEach (obj: any, iterator: any, context?: any): any {
    let key: any, length: any;
    if (obj) {
        if (isFunction(obj)) {
            for (key in obj) {
                if (key !== "prototype" && key !== "length" && key !== "name" && obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        } else if (isArray(obj) || isArrayLike(obj)) {
            let isPrimitive: boolean = typeof obj !== "object";
            for (key = 0, length = obj.length; key < length; key++) {
                if (isPrimitive || key in obj) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context, obj);
        } else if (isBlankObject(obj)) {
            // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        } else if (typeof obj.hasOwnProperty === "function") {
            // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        } else {
            // Slow path for objects which do not have a method `hasOwnProperty`
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        }
    }
    return obj;
}

function isBlankObject (value: any): boolean {
    return value !== null && typeof value === "object" && !Object.getPrototypeOf(value);
}

function isArrayLike (obj: any): boolean {

    // `null`, `undefined` and `window` are not array-like
    if (obj == null || isWindow(obj)) return false;

    // arrays, strings and jQuery/jqLite objects are array like
    // * jqLite is either the jQuery or jqLite constructor function
    // * we have to check the existence of jqLite first as this method is called
    //   via the forEach method when constructing the jqLite object in the first place
    if (isArray(obj) || isString(obj)) return true;

    // Support: iOS 8.2 (not reproducible in simulator)
    // "length" in obj used to prevent JIT error (gh-11508)
    let length: any = "length" in Object(obj) && obj.length;

    // NodeList objects (with `item` method) and
    // other objects with suitable length characteristics are array-like
    return isNumber(length) &&
        (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === "function");

}

function isWindow (obj: any): boolean {
    return obj && obj.window === obj;
}

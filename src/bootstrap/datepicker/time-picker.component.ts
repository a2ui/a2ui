import * as ng from "@angular/core";
import {DatePickerContainer} from "./date-picker-container.component";

@ng.Component({
    selector: "time-picker",
    templateUrl: "/src/bootstrap/datepicker/time-picker.component.html"
})
export class TimePickerComponent implements ng.OnInit {

    hours: any[] = [];
    minutes: any[] = [];

    hour: number = 12;
    hourAsString: string = "12";
    minute: number = 0;
    minuteAsString: string = "0";

    type: string = HourType[0];

    constructor (public container: DatePickerContainer) {
    }

    ngOnInit (): void {
        let self: TimePickerComponent = this;
        for (let i: number = 0; i <= 23; i++) {
            this.hours.push([i, TimePickerComponent.prefixWithZeroIfSmallerThanTen(i)]);
        }
        for (let i: number = 0; i <= 59; i++) {
            this.minutes.push([i, TimePickerComponent.prefixWithZeroIfSmallerThanTen(i)]);
        }

        this.container.setRefreshViewHandler((): void => {
            if (this.container.isDateEmpty()) {
                let now: Date = new Date();
                let hour: number = this.container.getDate().getHours();
                if (hour === 12) {
                    self.type = HourType[1];
                } else if (hour > 12) {
                    hour -= 12;
                    self.type = HourType[1];
                } else {
                    self.type = HourType[0];
                    if (hour === 0) {
                        hour = 12;
                    }
                }
                self.hour = hour;
                self.minute = now.getMinutes();
                this.container.selectTime(self.hour, self.minute);
            } else {
                let hour: number = this.container.getDate().getHours();
                if (hour === 12) {
                    self.type = HourType[1];
                } else if (hour > 12) {
                    hour -= 12;
                    self.type = HourType[1];
                } else {
                    self.type = HourType[0];
                    if (hour === 0) {
                        hour = 12;
                    }
                }
                self.hour = hour;
                self.minute = this.container.getDate().getMinutes();
            }
            this.hourToString();
            this.minuteToString();
        }, "time");

        this.container.setCompareHandler((date1: Date, date2: Date): number => {
            return TimePickerComponent.dateWithTime(date1).getTime() - TimePickerComponent.dateWithTime(date2).getTime();
        }, "time");

        this.container.refreshView();
    }

    isValid (): boolean {
        return this.hour !== null && this.minute !== null;
    }

    private changeType (): void {
        if (this.type === HourType[0]) {
            this.type = HourType[1];
        } else {
            this.type = HourType[0];
        }
    }

    private onHourKeyUp (event: KeyboardEvent): void {

        let shouldChangeTime: boolean = false;
        if (TimePickerComponent.isUpKey(event.keyCode)) {
            this.changeHour(true);
        } else if (TimePickerComponent.isUpDown(event.keyCode)) {
            this.changeHour(false);
        } else {
            shouldChangeTime = true;
        }

        if (this.hourAsString) {
            if (this.hourAsString.startsWith("0")) {
                this.hour = parseInt(this.hourAsString.substr(1, 2));
            } else {
                this.hour = parseInt(this.hourAsString);
                if (this.hour > 12) {
                    this.hour = 12;
                    this.hourAsString = "12";
                }
            }
        } else {
            this.hour = null;
        }

        if (shouldChangeTime) {
            this.changeTime();
        }
    }

    private changeHour (increase: boolean): void {
        if (increase) {
            if (this.hour === 12) {
                this.hour = 1;
            } else if (this.hour === 11) {
                this.hour = 12;
                this.changeType();
            } else {
                this.hour++;
            }
        } else {
            if (this.hour === 1) {
                this.hour = 12;
            } else if (this.hour === 12) {
                this.hour = 11;
                this.changeType();
            } else {
                this.hour--;
            }
        }
        this.hourToString();
        this.changeTime();
    }

    private hourToString (): void {
        if (this.hour < 10) {
            this.hourAsString = "0" + this.hour;
        } else {
            this.hourAsString = "" + this.hour;
        }
    }

    private onMinutesKeyUp (event: KeyboardEvent): void {

        let shouldChangeTime: boolean = false;
        if (TimePickerComponent.isUpKey(event.keyCode)) {
            this.changeMinutes(true);
        } else if (TimePickerComponent.isUpDown(event.keyCode)) {
            this.changeMinutes(false);
        } else {
            shouldChangeTime = true;
        }

        if (this.minuteAsString) {
            if (this.minuteAsString.startsWith("0")) {
                this.minute = parseInt(this.minuteAsString.substr(1, 2));
            } else {
                this.minute = parseInt(this.minuteAsString);
                if (this.minute > 59) {
                    this.minute = 59;
                    this.minuteAsString = "59";
                }
            }
        } else {
            this.minute = null;
        }

        if (shouldChangeTime) {
            this.changeTime();
        }
    }

    private changeMinutes (increase: boolean): void {
        if (increase) {
            if (this.minute === 59) {
                this.minute = 0;
            } else {
                this.minute++;
            }
        } else {
            if (this.minute === 0) {
                this.minute = 59;
            } else {
                this.minute--;
            }
        }
        this.minuteToString();
        this.changeTime();
    }

    private minuteToString (): void {
        if (this.minute < 10) {
            this.minuteAsString = "0" + this.minute;
        } else {
            this.minuteAsString = "" + this.minute;
        }
    }

    private changeType (): void {
        this.type = (this.type === HourType[1]) ? HourType[0] : HourType[1];
        this.changeTime();
    }

    private static isUpKey (keyCode: number): boolean {
        return keyCode === 38;
    }

    private static isUpDown (keyCode: number): boolean {
        return keyCode === 40;
    }

    private changeTime (): void {
        if (this.isValid()) {
            let hour: number = this.hour;
            if (this.type === HourType[1] && hour < 12) {
                hour = hour + 12;
            }
            if (this.type === HourType[0] && hour === 12) {
                hour = 0;
            }
            this.container.selectTime(hour, this.minute);
        }
    }

    private static prefixWithZeroIfSmallerThanTen (i: number): string {
        return i < 10 ? "0" + i : i + "";
    }

    private static dateWithTime (from: Date): Date {
        let result: Date = new Date();
        result.setHours(from.getHours());
        result.setMinutes(from.getMinutes());
        return result;
    }
}

enum HourType {
    AM,
    PM
}

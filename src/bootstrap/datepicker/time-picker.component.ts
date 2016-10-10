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
    minute: number = 0;

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
                self.hour = now.getHours();
                self.minute = now.getMinutes();
                this.container.selectTime(self.hour, self.minute);
            } else {
                self.hour = this.container.getDate().getHours();
                self.minute = this.container.getDate().getMinutes();
            }
        }, "time");

        this.container.setCompareHandler((date1: Date, date2: Date): number => {
            return TimePickerComponent.dateWithTime(date1).getTime() - TimePickerComponent.dateWithTime(date2).getTime();
        }, "time");

        this.container.refreshView();
    }

    changeType (): void {
        if (this.type === HourType[0]) {
            this.type = HourType[1];
        } else {
            this.type = HourType[0];
        }
    }

    onHourKeyUp (event: KeyboardEvent): void {
        if (TimePickerComponent.isUpKey(event.keyCode)) {
            this.changeHour(true);
        } else if (TimePickerComponent.isUpDown(event.keyCode)) {
            this.changeHour(false);
        }
    }

    changeHour (increase: boolean) {
        if (increase) {
            if (this.hour === 12) {
                this.hour = 1;
            } else {
                this.hour++;
            }
        } else {
            if (this.hour === 1) {
                this.hour = 12;
            } else {
                this.hour--;
            }
        }
    }

    onMinutesKeyUp (event: KeyboardEvent): void {
        if (TimePickerComponent.isUpKey(event.keyCode)) {
            this.changeMinutes(true);
        } else if (TimePickerComponent.isUpDown(event.keyCode)) {
            this.changeMinutes(false);
        }
    }

    changeMinutes (increase: boolean) {
        if (increase) {
            if (this.minute === 60) {
                this.minute = 1;
            } else {
                this.minute++;
            }
        } else {
            if (this.minute === 1) {
                this.minute = 60;
            } else {
                this.minute--;
            }
        }
    }

    onTypeKeyUp (event: KeyboardEvent): void {

    }

    private static isUpKey (keyCode: number): boolean {
        return keyCode === 38;
    }

    private static isUpDown (keyCode: number): boolean {
        return keyCode === 40;
    }


    private hourChanged (hour: any): void {
        this.container.selectTime(hour, this.minute);
    }

    private minuteChanged (minute: any): void {
        this.container.selectTime(this.hour, minute);
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


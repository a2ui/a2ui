import {Component, Input, OnInit, forwardRef} from "@angular/core";
import {DatePickerContainer} from "./date-picker-container.component";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

const IS_24_HOURS_MODE: boolean = true;

const TIME_PICKER_ACCESS: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true
};

@Component({
    selector: "a2-time-picker",
    templateUrl: "/src/bootstrap/datepicker/time-picker.component.html",
    providers: [TIME_PICKER_ACCESS]
})
export class TimePickerComponent implements OnInit, ControlValueAccessor {

    @Input("24HoursMode")
    fullMode: boolean = IS_24_HOURS_MODE;

    @Input()
    container: DatePickerContainer = null;

    hour: number = 12;
    hourAsString: string = "12";
    minute: number = 0;
    minuteAsString: string = "00";

    type: string = HourType[0];

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (val: any): void {
        if (val) {
            let values: string[] = val.split(":");
            this.hour = (this.fullMode) ? parseInt(values[0]) : this.prepareHour(parseInt(values[0]));
            this.minute = parseInt(values[1]);
            this.format();
        }
    }

    registerOnChange (fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched (fn: any): void {
        this.onTouched = fn;
    }

    ngOnInit (): void {
        if (!this.isSelfMode()) {
            let self: TimePickerComponent = this;

            this.container.setRefreshViewHandler((): void => {
                if (this.container.isDateEmpty()) {
                    let now: Date = new Date();
                    self.hour = (this.fullMode) ? now.getHours() : self.prepareHour(now.getHours());
                    self.minute = now.getMinutes();
                    this.container.selectTime(self.hour, self.minute);
                } else {
                    self.hour = (this.fullMode) ? this.container.getDate().getHours() : self.prepareHour(this.container.getDate().getHours());
                    self.minute = this.container.getDate().getMinutes();
                }
                this.format();
            }, "time");

            this.container.setCompareHandler((date1: Date, date2: Date): number => {
                return TimePickerComponent.dateWithTime(date1).getTime() - TimePickerComponent.dateWithTime(date2).getTime();
            }, "time");

            this.container.refreshView();
        }
    }

    isValid (): boolean {
        return this.hour !== null && !isNaN(this.hour)
            && this.minute !== null && !isNaN(this.minute);
    }

    private onHoursBlur (): void {
        this.formatHours();
        if (this.isValid()) {
            this.changeTime();
        }
    }

    private onMinutesBlur (): void {
        this.formatMinutes();
        if (this.isValid()) {
            this.changeTime();
        }
    }

    private format (): void {
        this.formatHours();
        this.formatMinutes();
    }

    private prepareHour (hour: number): number {
        if (hour === 12) {
            this.type = HourType[1];
        } else if (hour > 12) {
            hour -= 12;
            this.type = HourType[1];
        } else {
            this.type = HourType[0];
            if (hour === 0) {
                hour = 12;
            }
        }
        return hour;
    }

    private onHourKeyUp (event: KeyboardEvent): void {
        if (TimePickerComponent.isUpKey(event.keyCode)) {
            this.changeHour(true);
        } else if (TimePickerComponent.isUpDown(event.keyCode)) {
            this.changeHour(false);
        }

        if (this.hourAsString) {
            if (this.hourAsString.startsWith("0") && this.hourAsString.length > 1) {
                this.hour = parseInt(this.hourAsString.substr(1, 2), 0);
            } else {
                this.hour = parseInt(this.hourAsString, 0);
                if (this.fullMode && this.hour > 24) {
                    this.setHourAndFormat(23);
                } else if (this.hour > 12) {
                    this.setHourAndFormat(12);
                }
            }
        } else {
            this.hour = null;
        }
    }

    private changeHour (increase: boolean): void {
        if (increase) {
            if (this.fullMode) {
                if (this.hour === 23) {
                    this.hour = 0;
                } else {
                    this.hour++;
                }
            } else {
                if (this.hour === 12) {
                    this.hour = 1;
                } else if (this.hour === 11) {
                    this.hour = 12;
                    this.changeType();
                } else {
                    this.hour++;
                }
            }
        } else {
            if (this.fullMode) {
                if (this.hour === 0) {
                    this.hour = 23;
                } else {
                    this.hour--;
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
        }
        this.formatHours();
        this.changeTime();
    }

    private setHourAndFormat(hour: number): void {
        this.hour = hour;
        this.formatHours();
    }

    private formatHours (): void {
        if (this.hour === null || isNaN(this.hour)) {
            this.hour = 0;
            this.hourAsString = "00";
            this.changeTime();
        } else if (this.hour < 10) {
            this.hourAsString = "0" + this.hour;
        } else {
            this.hourAsString = "" + this.hour;
        }
    }

    private onMinutesKeyUp (event: KeyboardEvent): void {
        if (TimePickerComponent.isUpKey(event.keyCode)) {
            this.changeMinutes(true);
        } else if (TimePickerComponent.isUpDown(event.keyCode)) {
            this.changeMinutes(false);
        }

        if (this.minuteAsString) {
            if (this.minuteAsString.startsWith("0") && this.minuteAsString.length > 1) {
                this.minute = parseInt(this.minuteAsString.substr(1, 2), 0);
            } else {
                this.minute = parseInt(this.minuteAsString, 0);
                if (this.minute > 59) {
                    this.minute = 59;
                    this.minuteAsString = "59";
                }
            }
        } else {
            this.minute = null;
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
        this.formatMinutes();
        this.changeTime();
    }

    private formatMinutes (): void {
        if (this.minute === null || isNaN(this.minute)) {
            this.minute = 0;
            this.minuteAsString = "00";
            this.changeTime();
        } else if (this.minute < 10) {
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
            if (!this.fullMode) {
                if (this.type === HourType[1] && hour < 12) {
                    hour = hour + 12;
                }
                if (this.type === HourType[0] && hour === 12) {
                    hour = 0;
                }
            }
            if (this.isSelfMode()) {
                this.formatHours();
                this.onChange(((hour < 10) ? "0" + hour : hour ) + ":" + this.minuteAsString);
            } else {
                this.container.selectTime(hour, this.minute);
            }
        }
    }

    private isSelfMode (): boolean {
        return this.container === null;
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

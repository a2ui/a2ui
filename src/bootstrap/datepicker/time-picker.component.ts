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

    constructor (public container: DatePickerContainer) {
    }

    ngOnInit (): void {
        let self: TimePickerComponent = this;
        for (let i: number = 0; i <= 23; i++) {
            this.hours.push([i, TimePickerComponent.prepareValue(i)]);
        }
        for (let i: number = 0; i <= 59; i++) {
            this.minutes.push([i, TimePickerComponent.prepareValue(i)]);
        }

        this.container.setRefreshViewHandler(function (): void {
            if (this.isDateEmpty()) {
                let now: Date = new Date();
                self.hour = now.getHours();
                self.minute = now.getMinutes();
                this.selectTime(self.hour, self.minute);
            } else {
                self.hour = this.getDate().getHours();
                self.minute = this.getDate().getMinutes();
            }
        }, "time");

        this.container.setCompareHandler(function (date1: Date, date2: Date): number {
            return TimePickerComponent.dateWithTime(date1).getTime() - TimePickerComponent.dateWithTime(date2).getTime();
        }, "time");

        this.container.refreshView();
    }

    hourChanged (hour: any): void {
        this.container.selectTime(hour, this.minute);
    }

    minuteChanged (minute: any): void {
        this.container.selectTime(this.hour, minute);
    }

    private static prepareValue (i: number): string {
        return i < 10 ? "0" + i : i + "";
    }

    private static dateWithTime (from: Date): Date {
        let result: Date = new Date();
        result.setHours(from.getHours());
        result.setMinutes(from.getMinutes());
        return result;
    }
}


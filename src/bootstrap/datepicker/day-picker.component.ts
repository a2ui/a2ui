import * as ng from "@angular/core";
import {DatePickerContainer} from "./date-picker-container.component";
import {DateFormatter} from "./date-formatter";
import {TimePickerComponent} from "./time-picker.component";

const SHOW_WEEKS: boolean = true;
const FORMAT_DAY_TITLE: string = "MMMM yyyy";
const FORMAT_DAY_HEADER: string = "EEE";
const FORMAT_DAY: string = "dd";

@ng.Component({
    selector: "day-picker",
    templateUrl: "/src/bootstrap/datepicker/day-picker.component.html"
})
export class DayPickerComponent implements ng.OnInit {

    public labels: Array<any> = [];
    public title: string;
    public rows: Array<any> = [];
    public weekNumbers: Array<number> = [];

    @ng.Input()
    private showWeeks: boolean = SHOW_WEEKS;
    @ng.Input()
    private showTime: boolean = false;

    private formatDayHeader: string = FORMAT_DAY_HEADER;
    private formatDayTitle: string = FORMAT_DAY_TITLE;
    private formatDay: string = FORMAT_DAY;

    constructor (public container: DatePickerContainer) {
    }

    ngOnInit (): void {
        let self: DayPickerComponent = this;

        this.container.stepDay = {months: 1};

        this.container.setRefreshViewHandler(function (): void {
            let year: number = this.activeDate.getFullYear();
            let month: number = this.activeDate.getMonth();
            let firstDayOfMonth: Date = new Date(year, month, 1);
            let difference: number = this.startingDay - firstDayOfMonth.getDay();
            let numDisplayedFromPreviousMonth: number = (difference > 0) ? 7 - difference : -difference;
            let firstDate: Date = new Date(firstDayOfMonth.getTime());

            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }

            // 42 is the number of days on a six-week calendar
            let _days: Array<Date> = DayPickerComponent.getDates(firstDate, 42);
            let days: Array<any> = [];
            for (let i: number = 0; i < 42; i++) {
                let _dateObject: any = this.createDateObject(_days[i], self.formatDay);
                _dateObject.secondary = _days[i].getMonth() !== month;
                _dateObject.uid = this.uniqueId + "-" + i;
                days[i] = _dateObject;
            }

            self.labels = [];
            for (let j: number = 0; j < 7; j++) {
                self.labels[j] = {};
                self.labels[j].abbr = DateFormatter.format(days[j].date, self.formatDayHeader);
                self.labels[j].full = DateFormatter.format(days[j].date, "EEE");
            }

            self.title = DateFormatter.format(this.activeDate, self.formatDayTitle);
            self.rows = DatePickerContainer.split(days, 7);

            if (self.showWeeks) {
                self.weekNumbers = [];
                let thursdayIndex: number = (4 + 7 - this.startingDay) % 7,
                    numWeeks: number = self.rows.length;
                for (let curWeek: number = 0; curWeek < numWeeks; curWeek++) {
                    self.weekNumbers.push(DayPickerComponent.getISO8601WeekNumber(self.rows[curWeek][thursdayIndex].date));
                }
            }
        }, "day");

        this.container.setCompareHandler(function (date1: any, date2: any): number {
            if (date1 instanceof String) {
                date1 = new Date(date1);
            }
            if (date2 instanceof String) {
                date2 = new Date(date1);
            }
            let d1: Date = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
            let d2: Date = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
            return d1.getTime() - d2.getTime();
        }, "day");

        this.container.refreshView();
    }

    today (): void {
        if (!this.isCurrentDateDisbled()) {
            this.container.select(new Date());
        }
    }

    isCurrentDateDisbled (): boolean {
        return this.container.isDisabled(new Date());
    }

    private static getDates (startDate: Date, n: number): Array<Date> {
        let dates: Array<Date> = new Array(n);
        let current: Date = new Date(startDate.getTime());
        let i: number = 0;
        let date: Date;
        while (i < n) {
            date = new Date(current.getTime());
            dates[i++] = date;
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }

    private static getISO8601WeekNumber (date: Date): number {
        let checkDate: Date = new Date(date.getTime());
        // Thursday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        let time: number = checkDate.getTime();
        // Compare with Jan 1
        checkDate.setMonth(0);
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
    }
}

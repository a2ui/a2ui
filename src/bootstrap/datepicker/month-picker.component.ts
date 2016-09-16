import {Component, OnInit} from "@angular/core";
import {DatePickerContainer} from "./date-picker-container.component";
import {DateFormatter} from "./date-formatter";

const FORMAT_MONTH_TITLE: string = "yyyy";
const FORMAT_MONTH: string = "MMMM";

@Component({
    selector: "month-picker",
    templateUrl: "/src/bootstrap/datepicker/month-picker.component.html"
})
export class MonthPickerComponent implements OnInit {
    public title: string;
    public rows: Array<any> = [];
    private formatMonthTitle: string = FORMAT_MONTH_TITLE;
    private formatMonth: string = FORMAT_MONTH;

    constructor (public datePicker: DatePickerContainer) {
    }

    ngOnInit (): void {
        let self: MonthPickerComponent = this;

        this.datePicker.stepMonth = {years: 1};

        this.datePicker.setRefreshViewHandler((): void => {
            let months: Array<any> = new Array(12);
            let year: number = this.datePicker.activeDate.getFullYear();
            let date: Date;

            for (let i: number = 0; i < 12; i++) {
                date = new Date(year, i, 1);
                months[i] = this.datePicker.createDateObject(date, self.formatMonth);
                months[i].uid = this.datePicker.uniqueId + "-" + i;
            }

            self.title = DateFormatter.format(this.datePicker.activeDate, self.formatMonthTitle);
            self.rows = DatePickerContainer.split(months, 3);
        }, "month");

        this.datePicker.setCompareHandler((date1: Date, date2: Date): number => {
            let d1: Date = new Date(date1.getFullYear(), date1.getMonth());
            let d2: Date = new Date(date2.getFullYear(), date2.getMonth());
            return d1.getTime() - d2.getTime();
        }, "month");

        this.datePicker.refreshView();
    }
}

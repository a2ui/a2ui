import * as ng from "@angular/core";
import {DatePickerContainer} from "./date-picker-container.component";

const YEAR_RANGE: number = 16;
const FORMAT_YEAR: string = "yyyy";

@ng.Component({
    selector: "year-picker",
    templateUrl: "/src/bootstrap/datepicker/year-picker.component.html"
})
export class YearPickerComponent implements ng.OnInit {

    public rows: Array<any> = [];

    private title: string;
    private yearRange: number = YEAR_RANGE;
    private formatYear: string = FORMAT_YEAR;

    constructor (public datePicker: DatePickerContainer) {
    }

    ngOnInit (): void {
        let self: YearPickerComponent = this;

        this.datePicker.stepYear = {years: this.yearRange};

        this.datePicker.setRefreshViewHandler((): void => {
            let years: Array<any> = new Array(this.yearRange);
            let date: Date;

            for (let i: number = 0, start: number = self.getStartingYear(this.datePicker.activeDate.getFullYear() - 7); i < self.yearRange; i++) {
                date = new Date(start + i, 0, 1);
                years[i] = this.datePicker.createDateObject(date, self.formatYear);
                years[i].uid = this.datePicker.uniqueId + "-" + i;
            }

            self.title = [years[0].label, years[self.yearRange - 1].label].join(" - ");
            self.rows = DatePickerContainer.split(years, 4);
        }, "year");

        this.datePicker.setCompareHandler((date1: Date, date2: Date): number => {
            return date1.getFullYear() - date2.getFullYear();
        }, "year");

        this.datePicker.refreshView();
    }

    private getStartingYear (year: number): number {
        return ((year - 1) / this.yearRange) * this.yearRange + 1;
    }
}

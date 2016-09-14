import {Component} from "@angular/core";

@Component({
    selector: "a2uie-datepicker",
    templateUrl: "src/examples/bootstrap/datepicker/datepicker.example.component.html"
})
export class DatePickerExampleComponent {
    date: string = "2016-08-30";
    dateWithTime: string = "2016-08-30 12:22";
    dateRange: string = "2016-08-31 - 2016-09-12";
    dateWithTimeRange: string = "2016-08-31 12:22 - 2016-08-31 16:22";
}

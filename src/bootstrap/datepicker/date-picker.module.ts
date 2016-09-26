import {NgModule} from "@angular/core";

import {DateTimePickerInputComponent, DateTimePicker} from "./date-time-picker-input.component";
import {DatePickerInputComponent, DatePicker} from "./date-picker-input.component";
import {DateRangePickerInputComponent, DateRangePicker} from "./date-range-picker-input.component";
import {DateTimeRangePickerInputComponent, DateTimeRangePicker} from "./date-time-range-picker-input.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {Tooltip} from "./tooltip";
import {TimePickerComponent} from "./time-picker.component";
import {MonthPickerComponent} from "./month-picker.component";
import {DayPickerComponent} from "./day-picker.component";
import {YearPickerComponent} from "./year-picker.component";
import {DatePickerComponent} from "./date-picker.component";
import {DatePickerContainer} from "./date-picker-container.component";
import {DateRangePickerComponent} from "./date-range-picker.component";
import {DateTimePickerComponent} from "./date-time-picker.component";
import {DateTimeRangePickerComponent} from "./date-time-range-picker.component";

const EXPORTS: any[] = [
    DatePickerInputComponent, DateTimePickerInputComponent,
    DateRangePickerInputComponent, DateTimeRangePickerInputComponent
];

const DECLARATIONS: any[] = [
    Tooltip, TimePickerComponent, MonthPickerComponent, DayPickerComponent, YearPickerComponent,
    DatePickerInputComponent, DateTimePickerInputComponent, DateRangePickerInputComponent,
    DateTimeRangePickerInputComponent, DatePickerComponent, DatePickerContainer,
    DateRangePickerComponent, DateTimePickerComponent, DateTimeRangePickerComponent, 
    DatePicker, DateRangePicker, DateTimePicker, DateTimeRangePicker
];

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: DECLARATIONS,
    exports: EXPORTS,
    entryComponents: [DatePicker, DateRangePicker, DateTimePicker, DateTimeRangePicker]
})
export class DatePickerModule {
}

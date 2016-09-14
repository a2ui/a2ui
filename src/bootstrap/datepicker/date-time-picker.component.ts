import * as ng from "@angular/core";
import * as c from "@angular/forms";
import {DatePickerContainer} from "./date-picker-container.component";
import {DayPickerComponent} from "./day-picker.component";
import {MonthPickerComponent} from "./month-picker.component";
import {YearPickerComponent} from "./year-picker.component";
import {DateFormatter} from "./date-formatter";

const DATE_TIME_PICKER_VALUE_ACCESSOR: any = {
    provide: c.NG_VALUE_ACCESSOR,
    useExisting: ng.forwardRef(() => DateTimePickerComponent),
    multi: true
};

@ng.Component({
    selector: "date-time-picker",
    templateUrl: "/src/bootstrap/datepicker/date-time-picker.component.html",
    directives: [
        DatePickerContainer,
        DayPickerComponent,
        MonthPickerComponent,
        YearPickerComponent
    ],
    providers: [DATE_TIME_PICKER_VALUE_ACCESSOR]
})
export class DateTimePickerComponent implements c.ControlValueAccessor {

    @ng.Input("showWeeks") showWeeks: boolean;
    @ng.Input() minDate: Date;
    @ng.Input() maxDate: Date;

    @ng.Output("close") close: ng.EventEmitter<Date> = new ng.EventEmitter<Date>();

    private activeDate: Date;


    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (value: any): void {
        if (value) {
            if (value instanceof Date) {
                this.activeDate = new Date(value.getTime());
            } else {
                this.activeDate = DateFormatter.parse(value);
            }
        }
    }

    activeDateToDateTime (format ?: string): string {
        return this.activeDate ? DateFormatter.format(this.activeDate, format ? format : "yyyy-MM-dd HH:mm") : null;
    }

    registerOnChange (fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched (fn: any): void {
        this.onTouched = fn;
    }

    private onUpdate (event: any): void {
        setTimeout(() => {
            this.writeValue(event);
        }, 50);
    }

    private onClose (): void {
        this.close.emit(this.activeDate);
        this.onChange(this.activeDateToDateTime());
    }

    private dateNotSelected (): boolean {
        return this.activeDate === null;
    }
}

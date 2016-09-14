import * as ng from "@angular/core";
import * as c from "@angular/forms";
import {DatePickerContainer} from "./date-picker-container.component";
import {DayPickerComponent} from "./day-picker.component";
import {MonthPickerComponent} from "./month-picker.component";
import {YearPickerComponent} from "./year-picker.component";
import {DateFormatter} from "./date-formatter";
import {DateRangePickerComponent} from "./date-range-picker.component";

const DATE_TIME_RANGE_PICKER_VALUE_ACCESSOR: any = {
    provide: c.NG_VALUE_ACCESSOR,
    useExisting: ng.forwardRef(() => DateTimeRangePickerComponent),
    multi: true
};

@ng.Component({
    selector: "date-time-range-picker",
    templateUrl: "/src/bootstrap/datepicker/date-time-range-picker.component.html",
    directives: [
        DatePickerContainer,
        DayPickerComponent,
        MonthPickerComponent,
        YearPickerComponent
    ],
    providers: [DATE_TIME_RANGE_PICKER_VALUE_ACCESSOR]
})
export class DateTimeRangePickerComponent implements c.ControlValueAccessor {

    @ng.Input("showWeeks") showWeeks: boolean;
    @ng.Input() minDate: Date;
    @ng.Input() maxDate: Date;

    @ng.Output("close") close: ng.EventEmitter<Date> = new ng.EventEmitter<Date>();

    private startDate: Date;
    private endDate: Date;

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (value: any): void {
        if (value) {
            if (value instanceof Date) {
                this.startDate = value;
            } else {
                let parts: string[] = value.split(" - ");
                this.startDate = parts[0] ? DateFormatter.parse(parts[0]) : new Date();
                this.endDate = parts[1] ? DateFormatter.parse(parts[1]) : new Date();
            }
        }
    }

    toDateRange (format ?: string): string {
        let result: string = "";
        if (this.startDate !== undefined && this.startDate !== null) {
            result += DateFormatter.format(this.startDate, format ? format : "yyyy-MM-dd HH:mm");
        }
        if (this.endDate !== undefined && this.endDate !== null) {
            if (result.length > 0) {
                result += " - ";
            }
            result += DateFormatter.format(this.endDate, format ? format : "yyyy-MM-dd HH:mm");
        }
        return result;
    }

    registerOnChange (fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched (fn: any): void {
        this.onTouched = fn;
    }

    private onUpdate (value: any, type: RangeType): void {
        if (value) {
            if (type === RangeType.START) {
                this.startDate = DateFormatter.parse(value);
                if (DateRangePickerComponent.isDateLater(this.startDate, this.endDate)) {
                    this.endDate = new Date(this.startDate.getTime());
                }
            } else if (type === RangeType.END) {
                this.endDate = DateFormatter.parse(value);
                if (DateRangePickerComponent.isDateLater(this.startDate, this.endDate)) {
                    this.startDate = new Date(this.endDate.getTime());
                }
            }
        }
    }

    private onClose (): void {
        this.close.emit();
        this.onChange(this.toDateRange());
    }

    private dateNotSelected (): boolean {
        return this.startDate === null && this.endDate === null;
    }
}

enum RangeType {
    START,
    END
}

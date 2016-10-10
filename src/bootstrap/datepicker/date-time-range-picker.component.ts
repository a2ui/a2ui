import {Component, Input, Output, Directive, forwardRef, EventEmitter} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {DateFormatter} from "./date-formatter";
import {DateRangePickerComponent} from "./date-range-picker.component";
import {DateDecorator} from "./date-picker-container.component";

const DATE_TIME_RANGE_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimeRangePickerComponent),
    multi: true
};

@Component({
    selector: "date-time-range-picker",
    templateUrl: "/src/bootstrap/datepicker/date-time-range-picker.component.html",
    providers: [DATE_TIME_RANGE_PICKER_VALUE_ACCESSOR]
})
export class DateTimeRangePickerComponent implements ControlValueAccessor {

    @Input("showWeeks") showWeeks: boolean;
    @Input() minDate: Date;
    @Input() maxDate: Date;

    @Output("close") close: EventEmitter<Date> = new EventEmitter<Date>();

    private startDate: Date;
    private endDate: Date;
    private isValid: boolean;

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (value: any): void {
        if (value instanceof Date) {
            this.startDate = value;
        } else if (value) {
            let parts: string[] = value.split(" - ");
            this.startDate = parts[0] ? DateFormatter.parse(parts[0]) : new Date();
            if (isNaN(this.startDate.getTime())) {
                this.startDate = new Date();
            }
            this.endDate = parts[1] ? DateFormatter.parse(parts[1]) : new Date();
            if (isNaN(this.endDate.getTime())) {
                this.endDate = new Date();
            }
        }
    }

    registerOnChange (fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched (fn: any): void {
        this.onTouched = fn;
    }

    setValid (valid: boolean): void {
        this.isValid = valid;
    }

    private toDateRange (format ?: string): string {
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

    private onUpdate (value: DateDecorator, type: RangeType): void {
        if (value && value.date) {
            if (type === RangeType.START) {
                this.startDate = value.date;
                if (DateRangePickerComponent.isDateLater(this.startDate, this.endDate)) {
                    this.endDate = new Date(this.startDate.getTime());
                }
            } else if (type === RangeType.END) {
                this.endDate = value.date;
                if (DateRangePickerComponent.isDateLater(this.startDate, this.endDate)) {
                    this.startDate = new Date(this.endDate.getTime());
                }
            }
        }
        this.setValid(value.valid);
    }

    private onClose (): void {
        this.close.emit();
    }

    private onDone (): void {
        this.onClose();
        this.onChange(this.toDateRange());
    }

    private dateNotValid (): boolean {
        return (this.startDate === null && this.endDate === null) || !this.isValid;
    }
}

enum RangeType {
    START,
    END
}

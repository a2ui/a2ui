import * as ng from "@angular/core";
import * as c from "@angular/forms";
import {DateFormatter} from "./date-formatter";
import {DateDecorator} from "./date-picker-container.component";

const DATE_RANGE_PICKER_VALUE_ACCESSOR: any = {
    provide: c.NG_VALUE_ACCESSOR,
    useExisting: ng.forwardRef(() => DateRangePickerComponent),
    multi: true
};

@ng.Component({
    selector: "date-range-picker",
    templateUrl: "/src/bootstrap/datepicker/date-range-picker.component.html",
    providers: [DATE_RANGE_PICKER_VALUE_ACCESSOR]
})
export class DateRangePickerComponent implements c.ControlValueAccessor {

    @ng.Input("showWeeks") showWeeks: boolean;
    @ng.Input() minDate: Date;
    @ng.Input() maxDate: Date;

    @ng.Output("close") close: ng.EventEmitter<Date> = new ng.EventEmitter<Date>();

    private startDate: Date;
    private endDate: Date;
    private isValid: boolean;

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
            result += DateFormatter.format(this.startDate, format ? format : "yyyy-MM-dd");
        }
        if (this.endDate !== undefined && this.endDate !== null) {
            if (result.length > 0) {
                result += " - ";
            }
            result += DateFormatter.format(this.endDate, format ? format : "yyyy-MM-dd");
        }
        return result;
    }

    registerOnChange (fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched (fn: any): void {
        this.onTouched = fn;
    }

    static isDateLater (first: Date, second: Date): boolean {
        if (first && second) {
            return first.getTime() > second.getTime();
        }
        return true;
    }

    setValid (valid: boolean): void {
        this.isValid = valid;
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
            this.setValid(value.valid);
        }
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

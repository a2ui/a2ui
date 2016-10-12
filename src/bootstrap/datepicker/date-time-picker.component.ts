import {Component, Input, Output, Directive, forwardRef, EventEmitter} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {DateFormatter} from "./date-formatter";
import {DateDecorator} from "./date-picker-container.component";

const DATE_TIME_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerComponent),
    multi: true
};

@Component({
    selector: "a2-date-time-picker",
    templateUrl: "/src/bootstrap/datepicker/date-time-picker.component.html",
    providers: [DATE_TIME_PICKER_VALUE_ACCESSOR]
})
export class DateTimePickerComponent implements ControlValueAccessor {

    @Input("showWeeks") showWeeks: boolean;
    @Input() minDate: Date;
    @Input() maxDate: Date;

    @Output("close") close: EventEmitter<Date> = new EventEmitter<Date>();

    private activeDate: Date;
    private isValid: boolean;


    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (value: any): void {
        if (value instanceof Date) {
            this.activeDate = new Date(value.getTime());
        } else if (value) {
            this.activeDate = DateFormatter.parse(value);
            if (isNaN(this.activeDate.getTime())) {
                this.activeDate = new Date();
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

    private activeDateToDateTime (format ?: string): string {
        return this.activeDate ? DateFormatter.format(this.activeDate, format ? format : "yyyy-MM-dd HH:mm") : null;
    }

    private onUpdate (value: DateDecorator): void {
        setTimeout(() => {
            this.writeValue(value.date);
            this.setValid(value.valid);
        }, 50);
    }

    private onClose (): void {
        this.close.emit(this.activeDate);
    }

    private onDone (): void {
        this.onClose();
        this.onChange(this.activeDateToDateTime());
    }

    private dateNotValid (): boolean {
        return this.activeDate === null || !this.isValid;
    }
}

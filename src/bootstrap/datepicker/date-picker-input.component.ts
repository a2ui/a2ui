import * as ng from "@angular/core";
import * as c from "@angular/forms";
import {Tooltip} from "./tooltip";
import {DatePickerComponent} from "./date-picker.component";
import {ViewContainerRef} from "@angular/core";
import {isBlank} from "@angular/core/src/facade/lang";

const DATEPICKER_ACCESS: any = {
    provide: c.NG_VALUE_ACCESSOR,
    useExisting: ng.forwardRef(() => DatePickerInputComponent),
    multi: true
};

@ng.Directive({
    selector: "[date-picker]",
    host: {"(input)": "onChange($event.target.value)", "(blur)": "onTouched()"},
    providers: [DATEPICKER_ACCESS]
})
export class DatePickerInputComponent implements c.ControlValueAccessor {

    model: any;
    instance: any;

    _minDate: Date;
    _maxDate: Date;

    constructor (private vcr: ViewContainerRef,
                 private componentResolver: ng.ComponentResolver,
                 private _renderer: ng.Renderer) {
        this.createComponent().then((ref: ng.ComponentRef<any>) => {
            this.instance = <any>ref.instance;
            this.instance.onTouched = this.onTouched;
            this.instance.onChange = (val: any) => {
                this.writeValue(val);
                this.onChange(val);
            };
            this.instance.model = this.model;
            this.instance.hidden = false;
            this.instance.minDate = this._minDate;
            this.instance.maxDate = this._maxDate;
            this.instance.directive = this;
        });
    }

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (obj: any): void {
        this.model = obj;
        let normalizedValue: string = isBlank(obj) ? "" : obj;
        this._renderer.setElementProperty(this.vcr.element.nativeElement, "value", normalizedValue);
    }

    registerOnChange (fn: any): void {
        this.onChange = (l: any) => {
            this.model = l;
            this.instance.model = this.model;
            fn(l);
        };
    }

    registerOnTouched (fn: any): void {
        this.onTouched = () => {
            this.changeAvailability(true);
            fn();
        };
    }

    createComponent (): Promise<any> {
        return this.componentResolver.resolveComponent(DatePicker)
            .then((componentFactory: ng.ComponentFactory<any>) => {
                return this.vcr.createComponent(componentFactory);
            });
    }

    changeAvailability (disabled: boolean): void {
        this.instance.hidden = !disabled;
        this._renderer.setElementProperty(this.vcr.element.nativeElement, "disabled", !disabled);
    }

    @ng.Input("minDate")
    set minDate (minDate: Date) {
        if (this.instance !== undefined) {
            this.instance.minDate = minDate;
        }
        this._minDate = minDate;
    }

    @ng.Input("maxDate")
    set maxDate (maxDate: Date) {
        if (this.instance !== undefined) {
            this.instance.maxDate = maxDate;
        }
        this._maxDate = maxDate;
    }
}

@ng.Component({
    selector: "date-picker-input",
    directives: [
        Tooltip,
        DatePickerComponent
    ],
    template: `<div class="content">
                    <button [tooltip]="datePicker"
                        [trigger]="'click'"
                        (tooltipCtrl)="datePickerCtrl=$event"
                        (click)="directive.changeAvailability(hidden)"
                        type="button"
                        class="btn btn-default with"
                        placement="bottom"
                        aria-label="Calendar"
                        style="margin-left: 3px; height: 28px;">
                    <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
                </button>
                <template #datePicker>
                    <date-picker [(ngModel)]="model"
                                 (ngModelChange)="onChange($event);"
                                 (close)="onTouched(); datePickerCtrl.hide();"
                                 [showWeeks]="true"
                                 [minDate]="minDate"
                                 [maxDate]="maxDate">
                    </date-picker>
                </template>
            </div>`
})
export class DatePicker {
}

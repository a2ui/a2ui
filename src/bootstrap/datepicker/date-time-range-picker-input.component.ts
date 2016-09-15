import * as ng from "@angular/core";
import * as c from "@angular/forms";
import {ViewContainerRef} from "@angular/core";
import {isBlank} from "@angular/core/src/facade/lang";
import {ComponentRef} from "@angular/core";
import {ComponentFactory} from "@angular/core";

const DATE_TIME_RANGE_PICKER_ACCESS: any = {
    provide: c.NG_VALUE_ACCESSOR,
    useExisting: ng.forwardRef(() => DateTimeRangePickerInputComponent),
    multi: true
};

@ng.Directive({
    selector: "[date-time-range-picker]",
    host: {"(input)": "onChange($event.target.value)", "(blur)": "onTouched()"},
    providers: [DATE_TIME_RANGE_PICKER_ACCESS]
})
export class DateTimeRangePickerInputComponent implements c.ControlValueAccessor {

    model: any;
    instance: any;

    _minDate: Date;
    _maxDate: Date;

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    constructor (private vcr: ViewContainerRef,
                 private componentFactoryResolver: ng.ComponentFactoryResolver,
                 private _renderer: ng.Renderer) {
        let ref: ng.ComponentRef<DateTimeRangePicker> = this.createComponent();
        this.instance = <any>ref.instance;
        this.instance.hidden = false;
        this.instance.directive = this;
    }

    writeValue (obj: any): void {
        this.model = obj;
        this.instance.model = this.model;
        let normalizedValue: string = isBlank(obj) ? "" : obj;
        this._renderer.setElementProperty(this.vcr.element.nativeElement, "value", normalizedValue);
    }

    registerOnChange (fn: any): void {
        this.onChange = (l: any) => {
            this.model = l;
            this.instance.model = this.model;
            fn(l);
        };
        this.instance.onChange = (val: any) => {
            this.writeValue(val);
            this.onChange(val);
        };
    }

    registerOnTouched (fn: any): void {
        this.onTouched = () => {
            this.changeAvailability(true);
            fn();
        };
        this.instance.onTouched = this.onTouched;
    }

    createComponent (): ComponentRef<DateTimeRangePicker> {
        let componentFactory: ComponentFactory<DateTimeRangePicker> = this.componentFactoryResolver.resolveComponentFactory(DateTimeRangePicker);
        return this.vcr.createComponent(componentFactory);
    }

    changeAvailability (disabled: boolean): void {
        this.instance.hidden = !disabled;
        this._renderer.setElementProperty(this.vcr.element.nativeElement, "disabled", !disabled);
    }

    @ng.Input("minDate")
    set minDate (minDate: Date) {
        this._minDate = minDate;
        this.instance.minDate = this._minDate;
    }

    @ng.Input("maxDate")
    set maxDate (maxDate: Date) {
        this._maxDate = maxDate;
        this.instance.maxDate = this._maxDate;
    }
}

@ng.Component({
    selector: "date-range-picker-input",
    template: `<div class="content">
            <button [tooltip]="dateTimeRangePicker"
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
            <template #dateTimeRangePicker>
                <date-time-range-picker [(ngModel)]="model"                            
                            (ngModelChange)="onChange($event);"
                            (close)="onTouched(); datePickerCtrl.hide();"
                            [showWeeks]="true"
                            [minDate]="minDate"
                            [maxDate]="maxDate">
                </date-time-range-picker>
            </template></div>`
})
export class DateTimeRangePicker {
}

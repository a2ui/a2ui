import {Component, Input, Output, Directive, forwardRef, EventEmitter, ComponentFactoryResolver, Renderer, ViewContainerRef, ComponentRef, ComponentFactory} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {isBlank} from "./tooltip";

const DATEPICKER_ACCESS: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerInputComponent),
    multi: true
};

@Directive({
    selector: "[date-picker]",
    host: {"(input)": "onChange($event.target.value)", "(blur)": "onTouched()"},
    providers: [DATEPICKER_ACCESS]
})
export class DatePickerInputComponent implements ControlValueAccessor {

    model: any;
    instance: any;

    _minDate: Date;
    _maxDate: Date;

    constructor (private vcr: ViewContainerRef,
                 private componentFactoryResolver: ComponentFactoryResolver,
                 private _renderer: Renderer) {
        let ref: ComponentRef<DatePicker> = this.createComponent();
        this.instance = <any>ref.instance;
        this.instance.hidden = false;
        this.instance.directive = this;
    }

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (obj: any): void {
        this.model = obj;
        this.instance.model = this.model;
        let normalizedValue: string = isBlank(obj) ? "" : obj;
        this._renderer.setElementProperty(this.vcr.element.nativeElement, "value", normalizedValue);
    }

    registerOnChange (fn: any): void {
        this.onChange = (value: any) => {
            this.model = value;
            this.instance.model = this.model;
            fn(value);
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

    private createComponent (): ComponentRef<DatePicker> {
        let componentFactory: ComponentFactory<DatePicker> = this.componentFactoryResolver.resolveComponentFactory(DatePicker);
        return this.vcr.createComponent(componentFactory);
    }

    private changeAvailability (disabled: boolean): void {
        this.instance.hidden = !disabled;
        this._renderer.setElementProperty(this.vcr.element.nativeElement, "disabled", !disabled);
    }

    @Input("minDate")
    set minDate (minDate: Date) {
        this._minDate = minDate;
        this.instance.minDate = this._minDate;
    }

    @Input("maxDate")
    set maxDate (maxDate: Date) {
        this._maxDate = maxDate;
        this.instance.maxDate = this._maxDate;
    }
}

@Component({
    selector: "date-picker-input",
    templateUrl: "/src/bootstrap/datepicker/date-picker-input.component.html"
})
export class DatePicker {
}

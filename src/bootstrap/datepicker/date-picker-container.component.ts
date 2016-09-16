import {Component, Input, OnInit, OnChanges, EventEmitter} from "@angular/core";
import {DateFormatter} from "./date-formatter";

const INIT_DATE_PICKER_MODE: string = "day";
const INIT_MIN_MODE: string = "day";
const INIT_MAX_MODE: string = "year";

const STARTING_DAY: number = 0;

@Component({
    selector: "date-picker-container",
    events: ["update"],
    template: `
    <div [hidden]="!datepickerMode" class="well well-sm bg-faded p-a card margin-bottom-8" role="application" >
      <ng-content></ng-content>
    </div>
  `
})
export class DatePickerContainer implements OnInit, OnChanges {

    public datepickerMode: string = INIT_DATE_PICKER_MODE;
    public startingDay: number = STARTING_DAY;
    public stepDay: any = {};
    public stepMonth: any = {};
    public stepYear: any = {};
    public _activeDate: Date;
    public uniqueId: string;

    private modes: Array<string> = ["day", "month", "year"];
    private selectedDate: Date;
    private _initDate: Date;
    private activeDateId: string;

    @Input()
    private minDate: Date;
    @Input()
    private maxDate: Date;

    private minMode: string = INIT_MIN_MODE;
    private maxMode: string = INIT_MAX_MODE;

    private refreshViewHandlerDay: Function;
    private refreshViewHandlerTime: Function;
    private compareHandlerDay: Function;
    private compareHandlerTime: Function;
    private refreshViewHandlerMonth: Function;
    private compareHandlerMonth: Function;
    private refreshViewHandlerYear: Function;
    private compareHandlerYear: Function;
    private update: EventEmitter<DateDecorator> = new EventEmitter<DateDecorator>();

    @Input()
    private get initDate (): any {
        return this._initDate;
    }

    private set initDate (value: any) {
        this._initDate = value;
    }

    @Input()
    public get activeDate (): Date {
        return this._activeDate;
    }

    public set activeDate (value: Date) {
        this._activeDate = value;
        if (value) {
            this.selectedDate = new Date(value.getTime());
        }
        this.refreshView();
    }

    ngOnInit (): void {
        this.uniqueId = "datepicker-" + "-" + Math.floor(Math.random() * 10000);
        this.initialize();
    }

    initialize (): void {
        if (this.initDate) {
            if (this.initDate instanceof Date) {
                this.activeDate = this.initDate;
            } else {
                this.activeDate = DateFormatter.parse(this.initDate);
            }
        } else {
            this.activeDate = new Date();
        }
        this.selectedDate = new Date(this.activeDate.getTime());
        this.refreshView();
    }

    public ngOnChanges (): void {
        this.refreshView();
    }

    public setCompareHandler (handler: Function, type: string): void {
        if (type === "time") {
            this.compareHandlerTime = handler;
        }

        if (type === "day") {
            this.compareHandlerDay = handler;
        }

        if (type === "month") {
            this.compareHandlerMonth = handler;
        }

        if (type === "year") {
            this.compareHandlerYear = handler;
        }
    }

    public compare (date1: Date, date2: Date): number {
        if (this.isDatePickerMode("time") && this.compareHandlerTime) {
            return this.compareHandlerTime(date1, date2);
        }

        if (this.isDatePickerMode("day") && this.compareHandlerDay) {
            return this.compareHandlerDay(date1, date2);
        }

        if (this.isDatePickerMode("month") && this.compareHandlerMonth) {
            return this.compareHandlerMonth(date1, date2);
        }

        if (this.isDatePickerMode("year") && this.compareHandlerYear) {
            return this.compareHandlerYear(date1, date2);
        }

        return null;
    }

    public setRefreshViewHandler (handler: Function, type: string): void {
        if (type === "time") {
            this.refreshViewHandlerTime = handler;
        }
        if (type === "day") {
            this.refreshViewHandlerDay = handler;
        }
        if (type === "month") {
            this.refreshViewHandlerMonth = handler;
        }
        if (type === "year") {
            this.refreshViewHandlerYear = handler;
        }
    }

    public refreshView (): void {
        if (this.isDatePickerMode("day") && this.refreshViewHandlerDay) {
            this.refreshViewHandlerDay();
            if (this.refreshViewHandlerTime) {
                this.refreshViewHandlerTime();
            }
        }
        if (this.isDatePickerMode("month") && this.refreshViewHandlerMonth) {
            this.refreshViewHandlerMonth();
        }
        if (this.isDatePickerMode("year") && this.refreshViewHandlerYear) {
            this.refreshViewHandlerYear();
        }
    }

    public static split (arr: Array<any>, size: number): Array<any> {
        let arrays: Array<any> = [];
        while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
        }
        return arrays;
    }

    public select (date: Date): void {
        if (this.isDatePickerMode(this.minMode)) {
            if (!this.activeDate) {
                this.activeDate = new Date(0, 0, 0, 0, 0, 0, 0);
            }
        } else {
            this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) - 1];
        }
        this.activeDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

        this.selectedDate = new Date(this.activeDate.getTime());
        this.update.emit(this.currentDate());
        this.refreshView();
    }

    public selectTime (hour: number, minutes: number): void {
        this.activeDate.setHours(hour);
        this.activeDate.setMinutes(minutes);
        this.activeDate.setSeconds(0);
        this.selectedDate = new Date(this.activeDate.getTime());
        this.update.emit(this.currentDate());
        this.refreshView();
    }

    public move (direction: number): void {
        let expectedStep: any;
        if (this.isDatePickerMode("day")) {
            expectedStep = this.stepDay;
        }

        if (this.isDatePickerMode("month")) {
            expectedStep = this.stepMonth;
        }

        if (this.isDatePickerMode("year")) {
            expectedStep = this.stepYear;
        }

        if (expectedStep) {
            let year: number = this.activeDate.getFullYear() + direction * (expectedStep.years || 0);
            let month: number = this.activeDate.getMonth() + direction * (expectedStep.months || 0);
            this.activeDate.setFullYear(year, month, 1);

            this.refreshView();
        }
    }

    public toggleMode (direction: number): void {
        direction = direction || 1;

        if ((this.datepickerMode === this.maxMode && direction === 1) ||
            (this.datepickerMode === this.minMode && direction === -1)) {
            return;
        }

        this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) + direction];
        this.refreshView();
    }

    public isDisabled (date: Date): boolean {
        return ((this.minDate && this.compare(date, DateFormatter.toDate(this.minDate)) < 0)
        || (this.maxDate && this.compare(date, DateFormatter.toDate(this.maxDate)) > 0));
    }

    public createDateObject (date: Date, format: string): any {
        let dateObject: any = {};
        dateObject.date = date;
        dateObject.label = DateFormatter.format(date, format);
        dateObject.selected = this.compare(date, this.selectedDate) === 0;
        dateObject.disabled = this.isDisabled(date);
        dateObject.current = this.compare(date, new Date()) === 0;
        return dateObject;
    }

    public isDateEmpty (): boolean {
        return !this._activeDate;
    }

    public getDate (): Date {
        return this.isDateEmpty() ? null : this._activeDate;
    }

    private isValid (date: Date): boolean {
        return !this.isDisabled(date);
    }

    private isActive (dateObject: any): boolean {
        if (this.compare(dateObject.date, this.activeDate) === 0) {
            this.activeDateId = dateObject.uid;
            return true;
        }
        return false;
    }

    private currentDate (): DateDecorator {
        return {
            date: this.activeDate,
            valid: this.isValid(this.activeDate)
        };
    }

    private isDatePickerMode (mode: string): boolean {
        return this.datepickerMode === mode;
    }
}

export class DateDecorator {
    date: Date;
    valid: boolean;
}


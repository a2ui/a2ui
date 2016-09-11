import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";

@Component({
    selector: "a2-alert",
    templateUrl: "src/bootstrap/alert/alert.component.html"
})
export class Alert implements OnInit {
    @Input()
    public type: string;
    @Input()
    public skippable: boolean = false;
    @Input()
    public displayTime: number = undefined;
    @Output()
    public close: EventEmitter<any> = new EventEmitter();

    private timeout: any;

    ngOnInit(): any {
        if (this.displayTime !== undefined) {
            this.timeout = setTimeout(() => this.skippAlert(), this.displayTime);
        }
    }

    skippAlert(): void {
        this.skippable = false;
        clearTimeout(this.timeout);
        this.close.emit(undefined);
    }
}

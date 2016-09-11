import {Directive, OnInit, EventEmitter} from "@angular/core";

@Directive({
    outputs: ["onInitChange: a2OnInit"],
    selector: "[a2OnInit]",
})
export class OnInitDirective implements OnInit {
    onInitChange: EventEmitter<InitEvent> = new EventEmitter<InitEvent>();

    ngOnInit (): void {
        this.onInitChange.emit({time: new Date()});
    }
}

export interface InitEvent {
    time: Date;
}

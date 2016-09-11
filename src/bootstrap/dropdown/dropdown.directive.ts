import * as ng from "@angular/core";

// tslint:disable-next-line
const $: any = window["$"];

@ng.Directive({
    selector: "[a2Dropdown]"
})
export class DropdownDirective {

    constructor (ref: ng.ElementRef) {
        // tslint:disable-next-line
        ref.nativeElement["toggle"] = () => {
            $(ref.nativeElement).dropdown("toggle");
        };
    }
}

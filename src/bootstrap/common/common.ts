import {Component} from "@angular/core";

@Component({
    selector: "a2-header",
    template: "<ng-content></ng-content>"
})
export class Header {
}

@Component({
    selector: "a2-footer",
    template: "<ng-content></ng-content>"
})
export class Footer {
}
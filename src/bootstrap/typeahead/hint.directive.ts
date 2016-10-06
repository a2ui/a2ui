import {Directive, Input, HostBinding, HostListener, forwardRef, Inject} from "@angular/core";
import {SuggestionsComponent} from "./hints.component";

@Directive({
    selector: "[a2ui-hint]"
})
export class Hint {

    @Input("data") data: any;
    prev: Hint;
    next: Hint;
    @HostBinding("class.active") selected: boolean = false;

    constructor(@Inject(forwardRef(() => SuggestionsComponent)) private  parent: SuggestionsComponent) {
    }

    @HostListener("click") click(): void {
        this.parent.select(this);
    }

    activate(): void {
        this.selected = true;
    }

    deactivate(): void {
        this.selected = false;
    }
}

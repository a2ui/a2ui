import {Directive, Input, ElementRef, HostListener, forwardRef, Inject, Renderer} from "@angular/core";
import {SuggestionsComponent} from "./hints.component";

@Directive({
    selector: "[a2ui-hint]"
})
export class Hint {

    @Input("data") data: any;
    prev: Hint;
    next: Hint;

    constructor(private renderer: Renderer, private elem: ElementRef, @Inject(forwardRef(() => SuggestionsComponent)) private  parent: SuggestionsComponent) {
    }

    @HostListener("click") click(): void {
        this.parent.select(this);
    }

    public focus(): void {
        this.renderer.invokeElementMethod(this.elem.nativeElement.children[0], "focus", []);
    }

    public blur(): void {
        this.renderer.invokeElementMethod(this.elem.nativeElement.children[0], "blur", []);
    }
}

import {
    Inject, forwardRef, Component, animate, transition, style, state, trigger, Input,
    ContentChild
} from "@angular/core";
import {Accordion} from "./accordion.component";
import {Header, Footer} from "../common/common";

let nextId: number = 0;

@Component({
    selector: "a2-accordion-group",
    templateUrl: "src/bootstrap/accordion/accordion-group.component.html",
    animations: [
        trigger("state", [
            state("collapsed", style({
                display: "none",
                position: "relative",
                height: 0,
                overflow: "hidden"
            })),
            state("expanded", style({
                display: "block",
            })),
            transition("collapsed => expanded", animate("800ms ease-in-out")),
            transition("expanded => collapsed", animate("800ms ease-in-out"))
        ])
    ]
})
export class AccordionGroup {

    @Input() opened: boolean = false;
    @Input() disabled: boolean = false;
    @Input() name: string = "group-" + nextId++;
    @Input() header: string;
    @Input() type: string = "default";

    @ContentChild(Header) private headerTemplate: Header;
    @ContentChild(Footer) private footerTemplate: Footer;

    constructor(@Inject(forwardRef(() => Accordion)) private parent: Accordion) {
    }

    private toggle(): void {
        if (this.disabled) return;
        this.opened ? this.parent.close(this.name) : this.parent.open(this.name);
    }
}

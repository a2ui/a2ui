import {Inject, forwardRef, Component} from "@angular/core";
import {Accordion} from "./accordion.component";
import {animate} from "@angular/core";
import {transition} from "@angular/core";
import {style} from "@angular/core";
import {state} from "@angular/core";
import {trigger} from "@angular/core";
import {Input} from "@angular/core";

let nextId: number = 0;

@Component({
    selector: "a2-accordion-group",
    templateUrl: "src/bootstrap/accordion/accordion-group.component.html",
    animations: [
        trigger("state", [
            state("collapsed", style({
                display: "none"
            })),
            state("opened", style({
                display: "block"
            })),
            transition("collapsed => opened", [
                    style({
                        position: "relative",
                        height: 0,
                        overflow: "hidden"
                    }),
                    animate("800ms ease")
                ]
            ),
            transition("opened => collapsed", [
                    animate("800ms ease", style({
                        position: "relative",
                        height: 0,
                        overflow: "hidden"
                    }))
                ]
            )
        ])
    ]
})
export class AccordionGroup {

    @Input()
    public opened: boolean = false;
    @Input()
    public disabled: boolean = false;
    @Input()
    public name: string = "group-" + nextId++;
    @Input()
    public header: string;

    constructor(@Inject(forwardRef(() => Accordion)) public parent: Accordion) {
    }

    private toggle(): void {
        if (this.disabled) return;
        this.opened ? this.parent.close(this.name) : this.parent.open(this.name);
    }
}

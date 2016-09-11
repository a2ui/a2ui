import {Component, ViewChild, AfterContentInit} from "@angular/core";
import {
    AccordionGroupState, AccordionNavigationEvent,
    Accordion
} from "../../../bootstrap/accordion/accordion.component";

@Component({
    selector: "a2uie-accordion",
    templateUrl: "src/examples/bootstrap/accordion/accordion.example.component.html"
})
export class AccordionExampleComponent implements AfterContentInit {
    @ViewChild("acc")
    accordion: Accordion;

    ignoreDisabled: boolean = false;
    groupPresent: boolean = true;
    closeOthers: boolean = true;
    accordionNavigationState: AccordionNavigationEvent;
    accordionContentState: Array<AccordionGroupState> = [];

    ngAfterContentInit(): any {
        this.accordion.navigation.subscribe($event => {
            this.accordionNavigationState = $event;
        });

        this.accordion.contentChange.subscribe($event => {
            this.accordionContentState = $event;
            this.accordion.open($event[0].name);
        });
    }

    next(): void {
        if (!this.accordionNavigationState.next) return;
        this.accordion.open(this.accordionNavigationState.next);
    }

    prev(): void {
        if (!this.accordionNavigationState.prev) return;
        this.accordion.open(this.accordionNavigationState.prev);
    }
}

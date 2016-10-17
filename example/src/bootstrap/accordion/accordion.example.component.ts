import {Component, ViewChild, AfterContentInit} from "@angular/core";
import {
    AccordionGroupState, AccordionNavigationEvent,
    Accordion
} from "a2ui/bootstrap/accordion/accordion.component";

@Component({
    selector: "a2uie-accordion",
    templateUrl: "accordion.example.component.html"
})
export class AccordionExampleComponent implements AfterContentInit {
    @ViewChild("acc")
    accordion: Accordion;
    ignoreDisabled: boolean = false;
    groupPresent: boolean = true;
    closeOthers: boolean = true;
    accordionNavigationState: AccordionNavigationEvent;
    accordionContentState: Array<AccordionGroupState> = [];
        
    @ViewChild("wizard")
    wizardAccordion: Accordion;
    owner: any = {};
    coOwner: any = {};
    wizardNavigationState: AccordionNavigationEvent;

    ngAfterContentInit(): any {
        this.accordion.navigation.subscribe($event => {
            this.accordionNavigationState = $event;
        });

        this.accordion.contentChange.subscribe($event => {
            this.accordionContentState = $event;
            this.accordion.open($event[0].name);
        });

        this.wizardAccordion.navigation.subscribe($event => {
            this.wizardNavigationState = $event;
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

    toggle(field: string): void {
        this[field] = !this[field];
    }
    
    wizardNext(): void {
        if (!this.wizardNavigationState.next) return;
        this.wizardAccordion.open(this.wizardNavigationState.next);
    }
    wizardPrev(): void {
        if (!this.wizardNavigationState.prev) return;
        this.wizardAccordion.open(this.wizardNavigationState.prev);
    }
}

import {Component, forwardRef, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter} from "@angular/core";
import {Tab, TabHeader, TabBody} from "./tab.component";

@Component({
    selector: "a2-tabs",
    templateUrl: "src/bootstrap/tabs/tabs.component.html"
})
export class Tabs implements AfterContentInit {

    @Input()
    public type: string;
    @Input()
    public openedTab: string;
    @Output()
    public tabChange: EventEmitter<TabChangeEvent> = new EventEmitter<TabChangeEvent>();

    @ContentChildren(forwardRef(() => Tab))
    private tabs: QueryList<Tab>;

    ngAfterContentInit(): any {
        this.tabChange.emit({prev: undefined, current: this.openedTab});
    }

    open(tab: Tab): void {
        if (tab.disabled) return;
        this.tabChange.emit({prev: this.openedTab, current: tab.name});
        this.openedTab = tab.name;
    }
}

export interface TabChangeEvent {
    prev: string;
    current: string;
}

export const TABS_DIRECTIVES: Array<any> = [Tabs, Tab, TabHeader, TabBody];

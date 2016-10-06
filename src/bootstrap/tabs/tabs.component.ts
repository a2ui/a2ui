import {
    Component,
    forwardRef,
    ContentChildren,
    QueryList,
    AfterContentInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {Tab, TabHeader, TabBody} from "./tab.component";

@Component({
    selector: "a2-tabs",
    templateUrl: "src/bootstrap/tabs/tabs.component.html"
})
export class Tabs implements AfterContentInit {

    @Input() public type: string = "tabs";
    @Input() public openedTab: string;
    @Output() public tabChange: EventEmitter<TabChangeEvent> = new EventEmitter<TabChangeEvent>();
    @Output() public contentChange: EventEmitter<Array<TabState>> = new EventEmitter<Array<TabState>>();

    @ContentChildren(forwardRef(() => Tab)) private tabs: QueryList<Tab> = new QueryList<Tab>();

    ngAfterContentInit(): any {
        this.tabChange.emit({prev: undefined, current: this.openedTab});
        this.onContentChange();
        this.tabs.changes.subscribe(() => {
            this.onContentChange();
        });
    }

    open(name: string): void {
        let tab: Tab = this.getTabByName(name);
        if (tab) {
            this.openedTab = tab.name;
        }
    }

    private getTabByName(name: string): Tab {
        let matchingTabs: Array<Tab> = this.tabs.filter(tab => tab.name === name);
        return matchingTabs.length ? matchingTabs[0] : null;
    }

    private onContentChange(): void {
        this.contentChange.emit(this.tabs.map(tab => {
            return {name: tab.name, disabled: tab.disabled};
        }));
    }

    private _open(tab: Tab): void {
        if (tab.disabled) return;
        this.tabChange.emit({prev: this.openedTab, current: tab.name});
        this.openedTab = tab.name;
    }

    private isOpened(name: string): boolean {
        return name === this.openedTab;
    }
}

export interface TabChangeEvent {
    prev: string;
    current: string;
}

export interface TabState {
    name: string;
    disabled: boolean;
}

export const TABS_DIRECTIVES: Array<any> = [Tabs, Tab, TabHeader, TabBody];

import {Component, ViewChild} from "@angular/core";
import {TabChangeEvent, TabState, Tabs} from "a2ui/bootstrap/tabs/tabs.component";

@Component({
    selector: "a2uie-tabs",
    templateUrl: "tabs.example.component.html"
})
export class TabsExampleComponent {

    @ViewChild("tabs")
    tabs: Tabs;

    private lastTabChange: TabChangeEvent;
    private tabsStates: Array<TabState>;
    private visible: boolean = false;
    private type: string = "tabs";

    private toggleTabVisibility(): void {
        this.visible = !this.visible;
    }

    private tabChange(event: TabChangeEvent): void {
        this.lastTabChange = event;
    }

    private contentChange(event: Array<TabState>): void {
        this.tabsStates = event;
        this.tabs.open(this.tabsStates.find(tab => !tab.disabled).name);
    }

    private switchTypes(): void {
        this.type = this.type === "tabs" ? "pills" : "tabs";
    }
}

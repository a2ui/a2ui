---
layout: page
title: Tabs
root: false
permalink: /bootstrap/tabs
---

### Overview

Component a2-tabs is a collection of panels displayed horizontally.

<table>
    <tr>
        <th>Selector</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>a2-tabs</td>
        <td>Defines tabs component and its global configuration</td>
    </tr>
    <tr>
        <td>a2-tab</td>
        <td>Defines single tab panel</td>
    </tr>
</table>

## a2-tabs

# Inputs

<table>
    <tr>
        <th>Input</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>type</td>
        <td>string</td>
        <td>tabs</td>
        <td>Defines tabs type class (nav-{type}). Allow to use Bootstrap 4 classes like "tabs" and "pills".</td>
    </tr>
    <tr>
        <td>openedTab</td>
        <td>string</td>
        <td>N/A</td>
        <td>Determines initially opened tab by name</td>
    </tr>
</table>

# Outputs

<table>
    <tr>
        <th>Output</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>tabChange</td>
        <td>EventEmitter of TabChangeEvent</td>
        <td>Emits TabChangeEvent when opened tab is changed.</td>
    </tr>
    <tr>
        <td>contentChange</td>
        <td>EventEmitter of Array&lt;TabState&gt;</td>
        <td>Emits list of all available tabs every time when new tab is added or removed from DOM</td>
    </tr>
</table>

## a2-tab

# Inputs

<table>
    <tr>
        <th>Input</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>name</td>
        <td>string</td>
        <td>tab-{nextId}</td>
        <td>Defines name of specific tab.</td>
    </tr>
    <tr>
        <td>disabled</td>
        <td>boolean</td>
        <td>false</td>
        <td>Determines if given tab is disabled</td>
    </tr>
</table>

# Templates

<table>
    <tr>
        <th>Selector</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>template tabHeader</td>
        <td>Allow to define tab header.</td>
    </tr>
    <tr>
        <td>template tabFooter</td>
        <td>Allow to define tab footer.</td>
    </tr>
</table>

## Types

{% highlight ts %}
export interface TabChangeEvent {
    prev: string;
    current: string;
}

export interface TabState {
    name: string;
    disabled: boolean;
}
{% endhighlight %}

## Example

HTML:
{% highlight html %}

<div class="card">
    <div class="card-header">
        <h2>Tabs</h2>
    </div>

    <div class="card-body card-padding">
        <input type="button" (click)="toggleTabVisibility()" value="Toggle visibility">
        <input type="button" (click)="tabs.open('a2')" value="Open 2nd tab">
        <input type="button" (click)="switchTypes()" value="Switch types">

        <a2-tabs #tabs openedTab="a1" [type]="type" (tabChange)="tabChange($event)"
                 (contentChange)="contentChange($event)">
            <a2-tab name="a1">
                <template tabHeader>Tab 1</template>
                <template tabBody>
                    <table class="table">
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Age</th>
                        </tr>
                        <tr>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td>Eve</td>
                            <td>Jackson</td>
                            <td>94</td>
                        </tr>
                    </table>
                </template>
            </a2-tab>
            <a2-tab name="a2" [disabled]="true">
                <template tabHeader>Tab 2</template>
                <template tabBody>
                    <table class="table">
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Age</th>
                        </tr>
                        <tr>
                            <td>Dan</td>
                            <td>Smith</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td>Ben</td>
                            <td>Jackson</td>
                            <td>64</td>
                        </tr>
                    </table>
                </template>
            </a2-tab>
            <a2-tab name="a3">
                <template tabHeader>Tab 3</template>
                <template tabBody>
                    <table class="table">
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Age</th>
                        </tr>
                        <tr>
                            <td>Bill</td>
                            <td>Smith</td>
                            <td>54</td>
                        </tr>
                        <tr>
                            <td>Will</td>
                            <td>Jackson</td>
                            <td>34</td>
                        </tr>
                    </table>
                </template>
            </a2-tab>
            <a2-tab name="a4" *ngIf="visible">
                <template tabHeader>Tab 4</template>
                <template tabBody>
                    <table class="table">
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Age</th>
                        </tr>
                        <tr>
                            <td>Bill</td>
                            <td>Smith</td>
                            <td>54</td>
                        </tr>
                        <tr>
                            <td>Will</td>
                            <td>Jackson</td>
                            <td>34</td>
                        </tr>
                    </table>
                </template>
            </a2-tab>
        </a2-tabs>

        Tabs state: {{tabsStates | json}}
        Change event: {{lastTabChange | json}}
    </div>
</div>

{% endhighlight %}

TypeScript:

{% highlight ts %}
@Component({
    selector: "a2uie-tabs",
    templateUrl: "src/examples/bootstrap/tabs/tabs.example.component.html"
})
export class TabsExampleComponent {

    @ViewChild("tabs")
    tabs: Tabs;

    private lastTabChange: TabChangeEvent;
    private tabsStates: Array<TabState>;
    private visible: boolean = false;
    private type: string = "tabs";

    private toggleTabVisibility(): void {
        this.visible = !this.visible
    }

    private tabChange(event: TabChangeEvent): void {
        this.lastTabChange = event;
    }

    private contentChange(event: Array<TabState>): void {
        this.tabsStates = event;
        this.tabs.open(this.tabsStates.find(tab => !tab.disabled).name);
    }

    private switchTypes() {
        this.type = this.type === "tabs" ? "pills" : "tabs";
    }
}
{% endhighlight %}

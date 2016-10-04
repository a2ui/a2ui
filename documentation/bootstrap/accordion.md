---
layout: page
title: Accordion
root: false
permalink: /bootstrap/accordion
---

### Overview

Component a2-Accordion is a collection of panels displayed vertically.

<table>
    <tr>
        <th>Selector</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>a2-accordion</td>
        <td>Defines accordion component and its global configuration</td>
    </tr>
    <tr>
        <td>a2-accordion-group</td>
        <td>Defines single accordion panel group</td>
    </tr>
</table>

### a2-accordion

# Inputs

<table>
    <tr>
        <th>Input</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>closeOther</td>
        <td>boolean</td>
        <td>true</td>
        <td>Defines if other panels should be closed when panel is opened</td>
    </tr>
    <tr>
        <td>ignoreDisabled</td>
        <td>boolean</td>
        <td>false</td>
        <td>Defines if disabled panels should be skipped in navigation</td>
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
        <td>contentChange</td>
        <td>EventEmitter of AccordionGroupState</td>
        <td>Emits list of all available accordion groups every time when new group is added / removed from DOM</td>
    </tr>
    <tr>
        <td>change</td>
        <td>EventEmitter of AccordionChangeEvent</td>
        <td>When group is closed or opened emits its name and its current state</td>
    </tr>
    <tr>
        <td>navigation</td>
        <td>EventEmitter of AccordionNavigationEvent</td>
        <td>If closeOther is set to true emits names of current, next and previous opened groups. Can be used for wizard implementation.</td>
    </tr>
</table>

# Methods

<table>
    <tr>
        <th>Method</th>
        <th>Signature</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>open</td>
        <td>open(name: string): void</td>
        <td>Allow to open given group by its name.</td>
    </tr>
    <tr>
        <td>close</td>
        <td>close(name: string): void</td>
        <td>Allow to close given group by its name.</td>
    </tr>
</table>

### a2-accordion-group

# Inputs
<table>
    <tr>
        <th>Input</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>opened</td>
        <td>boolean</td>
        <td>false</td>
        <td>Defines if given group should be opened</td>
    </tr>
    <tr>
        <td>disabled</td>
        <td>boolean</td>
        <td>false</td>
        <td>Defines if given group should be disabled</td>
    </tr>
    <tr>
        <td>name</td>
        <td>string</td>
        <td>group-{id}</td>
        <td>Defines custom group name</td>
    </tr>
    <tr>
        <td>header</td>
        <td>string</td>
        <td>N/A</td>
        <td>Defines group header text</td>
    </tr>
    <tr>
        <td>type</td>
        <td>string</td>
        <td>default</td>
        <td>Bootstrap panel type class name. One of the following "success", "info", "warning", "danger"</td>
    </tr>
</table>

# Templates

<table>
    <tr>
        <th>Selector</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>a2-Header</td>
        <td>Allow to define custom group header. When present header input for group is ignored.</td>
    </tr>
    <tr>
        <td>a2-Footer</td>
        <td>Allow to define custom group footer.</td>
    </tr>
</table>

## Types

{% highlight ts %}
export interface AccordionNavigationEvent {
    prev: string;
    current: string;
    next: string;
}
{% endhighlight %}

**prev** - previous group name

**current** - currently opened group name

**next** - name of next group to be opened

{% highlight ts %}
export interface AccordionChangeEvent {
    name: string;
    opened: boolean;
}
{% endhighlight %}

**name** - group name

**opened** -  indicates if given group is opened

{% highlight ts %}
export interface AccordionGroupState {
    name: string;
    opened: boolean;
    disabled: boolean;
}
{% endhighlight %}

Represents initial state of accordion group.

**name** - group name

**opened** - indicates if given group is opened

**disabled** - indicates if given group is disabled

## Example

HTML:
{% highlight html %}
        <button (click)="prev();">Prev</button>
        <button (click)="next();">Next</button>
        <button (click)="toggleGroupPresence();">Toggle group presence</button>

        <a2-accordion #acc [closeOther]="true" [ignoreDisabled]="true">
            <a2-accordion-group [opened]="true" header="One" type="success">
                <ul>
                    <li>Example content</li>
                    <li>Example content</li>
                </ul>
            </a2-accordion-group>
            <a2-accordion-group [disabled]="true" type="info">
                <a2-header>
                    <div><b><i>Two</i></b></div>
                </a2-header>
                <ul>
                    <li>Example content</li>
                    <li>Example content</li>
                </ul>
                <a2-footer><i>Footer</i></a2-footer>
            </a2-accordion-group>
            <a2-accordion-group header="Three" type="danger">
                <ul>
                    <li>Example content</li>
                    <li>Example content</li>
                </ul>
            </a2-accordion-group>
            <a2-accordion-group *ngIf="groupPresent" header="Four">
                <ul>
                    <li>Example content</li>
                    <li>Example content</li>
                </ul>
            </a2-accordion-group>
        </a2-accordion>

{% endhighlight %}

TypeScript:

{% highlight ts %}

@Component({
//...
})
export class AccordionExampleComponent implements AfterContentInit {
    @ViewChild("acc")
    accordion: Accordion;
    groupPresent: boolean = true;
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

    toggleGroupPresence(): void {
        this.groupPresent = !this.groupPresent;
    }
}
{% endhighlight %}

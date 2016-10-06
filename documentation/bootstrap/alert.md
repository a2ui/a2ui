---
layout: page
title: Alert
root: false
permalink: /bootstrap/alert
---

### Overview

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
        <td>success</td>
        <td>Defines alert type class (alert-{type}). Allow to use Bootstrap 4 classes like "success", "info", "warning" and "danger".</td>
    </tr>
    <tr>
        <td>skippable</td>
        <td>boolean</td>
        <td>false</td>
        <td>Defines if alert can be dismissed</td>
    </tr>
    <tr>
        <td>displayTime</td>
        <td>number</td>
        <td>false</td>
        <td>Defines alert display time. If not defined alert will persist</td>
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
        <td>close</td>
        <td>EventEmitter</td>
        <td>Emits event when alert is closed. Has no payload</td>
    </tr>
</table>

## Example

HTML:
{% highlight html %}

    <button (click)="createAlerts()">Add few alerts!</button>

    <p *ngFor="let alert of alerts; let i = index">
        <a2-alert [type]="alert.type" [skippable]="alert.skippable"
               [displayTime]="alert.displayTime" (close)="hideEvent(i)">{{alert.content}}
        </a2-alert>
    </p>

{% endhighlight %}

TypeScript:

{% highlight ts %}

@Component({
    selector: "a2uie-alert",
    templateUrl: "src/examples/bootstrap/alert/alert.example.component.html"
})
export class AlertExampleComponent {
    alerts: Array<any> = [];

    createAlerts(): void {
        this.alerts = [
            {type: "success", content: "Alert", skippable: false},
            {type: "info", content: "Skippable alert", skippable: true},
            {type: "warning", content: "Alert with display time 5 seconds", skippable: false, displayTime: 5000},
            {type: "danger", content: "Skippable alert with display time 7 seconds", skippable: true, displayTime: 7000}
        ];
    }

    hideEvent(index: number): void {
        this.alerts.splice(index, 1);
    }
}
{% endhighlight %}

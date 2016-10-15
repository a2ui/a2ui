import {Component} from "@angular/core";

@Component({
    selector: "a2uie-alert",
    templateUrl: "alert.example.component.html"
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

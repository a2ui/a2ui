import {Component} from "@angular/core";
import {ComponentInsidePopoverComponent} from "./component-inside-popover.component";

@Component({
    selector: "a2uie-popover",
    templateUrl: "src/examples/bootstrap/popover/popover.example.component.html"
})
export class PopoverExampleComponent {
    componentInsidePopoverComponent: any = ComponentInsidePopoverComponent;
}

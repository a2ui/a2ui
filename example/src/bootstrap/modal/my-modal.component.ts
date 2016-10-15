import {OpaqueToken, Component, Inject} from "@angular/core";
import {ModalActions} from "a2ui/bootstrap/modal/modal";

export const MY_MODAL_DEPENDENCY: OpaqueToken =
    new OpaqueToken("myModalDependency");

@Component({
    selector: "my-modal",
    templateUrl: "my-modal.component.html"
})
export class MyModalComponent {
    constructor (@Inject(MY_MODAL_DEPENDENCY) public dynamicDependency: any,
                 public actions: ModalActions) {}
    discard (): void { this.actions.discard(); }
    close (): void { this.actions.close({"my": "data to return from popup"}); }
    error (): void { this.actions.error({"close": "with error data"}); }
}

import {Component} from "@angular/core";
import {Modal, ModalInstance} from "../../../bootstrap/modal/modal";
import {MyModalComponent, MY_MODAL_DEPENDENCY} from "./my-modal.component";

@Component({
    selector: "a2uie-modal",
    templateUrl: "src/examples/bootstrap/modal/modal.example.component.html"
})
export class ModalExampleComponent {
    modalSuccessResult: any;
    modalSuccessError: any;
    modalDone: any;

    constructor(private modal: Modal) {
    }

    showModal(): void {
        this.modal.create({
            component: MyModalComponent,
            providers: [{provide: MY_MODAL_DEPENDENCY, useValue: 42}]
        }).subscribe((instance: ModalInstance) => {
            instance.result.subscribe((result: any) => {
                this.modalSuccessResult = result;
            }, (error: any) => {
                this.modalSuccessError = error;
            }, () => {
                this.modalDone = "Modal is done with us";
            });
        }, (error: any) => {
            this.modalSuccessError = error;
        });
    }
}

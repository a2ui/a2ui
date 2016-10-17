import {Component} from "@angular/core";
import {MyModalComponent, MY_MODAL_DEPENDENCY} from "./my-modal.component";
import {Modal, ModalInstance} from "a2ui/bootstrap/modal/modal";

@Component({
    selector: "a2uie-modal",
    templateUrl: "modal.example.component.html"
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

import {Component} from "@angular/core";

@Component({
    selector: "a2uie-mask",
    templateUrl: "src/examples/utils/mask/mask.example.component.html"
})
export class MaskExampleComponent {
    date: string = "2016-08-30";
    phone: string = "600-100-200";
    zipCode: string = "00-712";
    bankAccount = "86 1020 2498 1111 2222 3333 4444"
}
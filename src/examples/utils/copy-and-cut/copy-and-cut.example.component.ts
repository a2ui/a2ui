import {Component} from "@angular/core";
import * as cb from "../../../clipboard/clipbard";

@Component({
    selector: "a2uie-copy-and-cut",
    templateUrl: "src/examples/utils/copy-and-cut/copy-and-cut.example.component.html"
})
export class CopyAndCutExampleComponent {
    copy: cb.Action = cb.copy;
    cut: cb.Action = cb.cut;
}

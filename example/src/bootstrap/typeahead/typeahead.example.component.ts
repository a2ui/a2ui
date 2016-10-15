import {ViewChild, Component} from "@angular/core";
import {WikiService} from "./wiki.service";
import {TypeaheadComponent} from "a2ui/bootstrap/typeahead/typeahead.component";

@Component({
    providers: [WikiService],
    selector: "a2uie-typeahead",
    templateUrl: "typeahead.example.component.html"
})
export class TypeaheadExampleComponent {
    @ViewChild("typeahead") typeahead: TypeaheadComponent;

    constructor(private wikiService: WikiService) {
    }

    typeaheadProps(): Array<string> {
        return Object.keys(this.typeahead)
                     .filter(property => {
                         let val: any = this.typeahead[property];
                         return ["string", "number"].indexOf(typeof val) != -1;
                     });
    }
}

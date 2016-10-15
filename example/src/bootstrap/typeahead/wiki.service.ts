import {URLSearchParams, Jsonp} from "@angular/http";
import {Injectable} from "@angular/core";
import {AutocompleteSupplier} from "a2ui/bootstrap/typeahead/typeahead.component";

@Injectable()
export class WikiService {
    constructor(private jsonp: Jsonp) {
    }

    public provide: AutocompleteSupplier = (term: string) => {
        let search: URLSearchParams = new URLSearchParams();
        search.set("action", "opensearch");
        search.set("search", term);
        search.set("format", "json");
        return this.jsonp
            .get("http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK", {search})
            .map(response => response.json()[1]);
    }
}

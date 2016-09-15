import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {BOOTSTRAP_EVENTS_PLUGIN} from "./bootstrap_events";
import {PopoverDirective} from "./popover/popover.directive";
import {DropdownDirective} from "./dropdown/dropdown.directive";
import {ACCORDION_DIRECTIVES} from "./accordion/accordion.component";
import {Rating} from "./rating/rating.component";
import {Alert} from "./alert/alert.component";
import {TABS_DIRECTIVES} from "./tabs/tabs.component";
import {PAGINATION_DIRECTIVES} from "./pagination/pagination.component";
import {DataTable, Column, Header, Footer} from "./data-table/data-table.component";
import {Modal} from "./modal/modal";
import {HttpModule, JsonpModule} from "@angular/http";
import {DatePickerModule} from "./datepicker/date-picker.module";

const BOOTSTRAP_DIRECTIVES: any[] = [PopoverDirective, DropdownDirective, ACCORDION_DIRECTIVES, Rating, Alert,
    TABS_DIRECTIVES, PAGINATION_DIRECTIVES, DataTable, Column, Header, Footer
];

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, JsonpModule, DatePickerModule],
    declarations: BOOTSTRAP_DIRECTIVES,
    exports: [BOOTSTRAP_DIRECTIVES, DatePickerModule],
    providers: [BOOTSTRAP_EVENTS_PLUGIN, Modal]
})
export class BootstrapModule {
}

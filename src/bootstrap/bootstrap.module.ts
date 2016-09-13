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
import {DateTimePickerInputComponent} from "./datepicker/date-time-picker-input.component";
import {DatePickerInputComponent} from "./datepicker/date-picker-input.component";
import {DateRangePickerInputComponent} from "./datepicker/date-range-picker-input.component";
import {DateTimeRangePickerInputComponent} from "./datepicker/date-time-range-picker-input.component";

const BOOTSTRAP_DIRECTIVES: any[] = [PopoverDirective, DropdownDirective, ACCORDION_DIRECTIVES, Rating, Alert,
    TABS_DIRECTIVES, PAGINATION_DIRECTIVES, DataTable, Column, Header, Footer, DatePickerInputComponent,
    DateTimePickerInputComponent, DateRangePickerInputComponent, DateTimeRangePickerInputComponent
];

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, JsonpModule],
    declarations: BOOTSTRAP_DIRECTIVES,
    exports: BOOTSTRAP_DIRECTIVES,
    providers: [BOOTSTRAP_EVENTS_PLUGIN, Modal]
})
export class BootstrapModule {
}

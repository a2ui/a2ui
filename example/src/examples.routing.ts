import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {OnInitExampleComponent} from "./utils/on-init/on-init.example.component";
import {BootstrapExampleComponent} from "./bootstrap.example.component";
import {WelcomeExampleComponent} from "./welcome.example.component";
import {UtilsExampleComponent} from "./utils.example.component";
import {CopyAndCutExampleComponent} from "./utils/copy-and-cut/copy-and-cut.example.component";
import {WatcherExampleComponent} from "./utils/watcher/watcher.example.component";
import {UploadExampleComponent} from "./utils/upload/upload.example.component";
import {ModalExampleComponent} from "./bootstrap/modal/modal.example.component";
import {PopoverExampleComponent} from "./bootstrap/popover/popover.example.component";
import {AccordionExampleComponent} from "./bootstrap/accordion/accordion.example.component";
import {DropdownExampleComponent} from "./bootstrap/dropdown/dropdown.example.component";
import {TabsExampleComponent} from "./bootstrap/tabs/tabs.example.component";
import {PaginationExampleComponent} from "./bootstrap/pagination/pagination.example.component";
import {TableExampleComponent} from "./bootstrap/table/table.example.component";
import {DatePickerExampleComponent} from "./bootstrap/datepicker/datepicker.example.component";
import {AlertExampleComponent} from "./bootstrap/alert/alert.example.component";
import {RatingExampleComponent} from "./bootstrap/rating/rating.example.component";
import {TypeaheadExampleComponent} from "./bootstrap/typeahead/typeahead.example.component";
import {MaskExampleComponent} from "./utils/mask/mask.example.component";

export const appRoutes: Routes = [
    {path: "", component: WelcomeExampleComponent, data: {readable: "Welcome"}},
    {
        path: "bootstrap", component: BootstrapExampleComponent, data: {readable: "Bootstrap"},
        children: [
            {path: "accordion", component: AccordionExampleComponent, data: {readable: "Accordion"}},
            {path: "alert", component: AlertExampleComponent, data: {readable: "Alert"}},
            {path: "datepicker", component: DatePickerExampleComponent, data: {readable: "Datepicker"}},
            {path: "dropdown", component: DropdownExampleComponent, data: {readable: "Dropdown"}},
            {path: "rating", component: RatingExampleComponent, data: {readable: "Rating"}},
            {path: "modal", component: ModalExampleComponent, data: {readable: "Modal"}},
            {path: "pagination", component: PaginationExampleComponent, data: {readable: "Pagination"}},
            {path: "popover", component: PopoverExampleComponent, data: {readable: "Popover"}},
            {path: "table", component: TableExampleComponent, data: {readable: "Table"}},
            {path: "tabs", component: TabsExampleComponent, data: {readable: "Tabs"}},
            {path: "typeahead", component: TypeaheadExampleComponent, data: {readable: "Typeahead"}}
        ]
    },
    {
        path: "utils", component: UtilsExampleComponent, data: {readable: "Utils"},
        children: [
            {path: "on-init", component: OnInitExampleComponent, data: {readable: "On Init Expression"}},
            {path: "copy-and-cut", component: CopyAndCutExampleComponent, data: {readable: "Copy & Cut"}},
            {path: "watcher", component: WatcherExampleComponent, data: {readable: "Watcher"}},
            {path: "upload", component: UploadExampleComponent, data: {readable: "Upload"}},
            {path: "mask", component: MaskExampleComponent, data: {readable: "Mask"}},
        ]
    }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

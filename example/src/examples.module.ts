import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {A2uiModule} from "a2ui/a2ui.module";
import {routing, appRoutingProviders} from "./examples.routing";
import {NavigationBar} from "./navigation-bar.component";
import {BootstrapExampleComponent} from "./bootstrap.example.component";
import {WelcomeExampleComponent} from "./welcome.example.component";
import {MyModalComponent} from "./bootstrap/modal/my-modal.component";
import {OnInitExampleComponent} from "./utils/on-init/on-init.example.component";
import {UtilsExampleComponent} from "./utils.example.component";
import {WatcherExampleComponent} from "./utils/watcher/watcher.example.component";
import {CopyAndCutExampleComponent} from "./utils/copy-and-cut/copy-and-cut.example.component";
import {UploadExampleComponent} from "./utils/upload/upload.example.component";
import {ModalExampleComponent} from "./bootstrap/modal/modal.example.component";
import {PopoverExampleComponent} from "./bootstrap/popover/popover.example.component";
import {ComponentInsidePopoverComponent} from "./bootstrap/popover/component-inside-popover.component";
import {AccordionExampleComponent} from "./bootstrap/accordion/accordion.example.component";
import {DropdownExampleComponent} from "./bootstrap/dropdown/dropdown.example.component";
import {TabsExampleComponent} from "./bootstrap/tabs/tabs.example.component";
import {PaginationExampleComponent} from "./bootstrap/pagination/pagination.example.component";
import {TableExampleComponent} from "./bootstrap/table/table.example.component";
import {DatePickerExampleComponent} from "./bootstrap/datepicker/datepicker.example.component";
import {TypeaheadExampleComponent} from "./bootstrap/typeahead/typeahead.example.component";
import {MaskExampleComponent} from "./utils/mask/mask.example.component";
import {AlertExampleComponent} from "./bootstrap/alert/alert.example.component";
import {RatingExampleComponent} from "./bootstrap/rating/rating.example.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, A2uiModule, routing],
    declarations: [
        WelcomeExampleComponent, BootstrapExampleComponent, MyModalComponent, NavigationBar, OnInitExampleComponent,
        UtilsExampleComponent, WatcherExampleComponent, CopyAndCutExampleComponent, UploadExampleComponent, ModalExampleComponent,
        PopoverExampleComponent, ComponentInsidePopoverComponent, AccordionExampleComponent, DropdownExampleComponent,
        TabsExampleComponent, PaginationExampleComponent, TableExampleComponent, DatePickerExampleComponent, TypeaheadExampleComponent,
        MaskExampleComponent, RatingExampleComponent, AlertExampleComponent
    ],
    entryComponents: [MyModalComponent, ComponentInsidePopoverComponent],
    providers: [appRoutingProviders],
    exports: [NavigationBar]
})
export class ExamplesModule {

}


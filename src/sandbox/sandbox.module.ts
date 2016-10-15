import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {SandboxComponent} from "./sandbox.component";
import {A2uiModule} from "../a2ui.module";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, A2uiModule, RouterModule],
    declarations: [SandboxComponent],
    bootstrap: [SandboxComponent]
})
export class SandboxModule {
}

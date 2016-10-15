import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {HttpModule} from "@angular/http";
import {A2uiModule} from "a2ui/a2ui.module";
import {ExamplesModule} from "./examples.module";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, A2uiModule, ExamplesModule, RouterModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

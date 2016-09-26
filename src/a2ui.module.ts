import {NgModule} from "@angular/core";
import {WatchDirective} from "./watch/watch.directive";
import {OnInitDirective} from "./on-init/on-init.directive";
import {BootstrapModule} from "./bootstrap/bootstrap.module";
import {UPLOAD_DIRECTIVES} from "./upload/upload.directive";
import MaskedInputDirective from "./mask/input-mask.directive";

const ANGULAR_HELPERS: any[] = [WatchDirective, OnInitDirective, UPLOAD_DIRECTIVES, MaskedInputDirective];

@NgModule({
    imports: [BootstrapModule],
    declarations: ANGULAR_HELPERS,
    exports: [BootstrapModule, ANGULAR_HELPERS]
})
export class A2uiModule {
}

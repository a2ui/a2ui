import {Component, OnInit, ViewChild, ElementRef, trigger, state, style, transition, animate} from "@angular/core";
import {Routes} from "@angular/router";
import {appRoutes} from "./examples.routing";

@Component({
    selector: "a2uie-navigation-bar",
    templateUrl: "navigation-bar.component.html",
    animations: [trigger("menu", [
        state("show", style({display: "block", height: "*"})),
        state("hide", style({display: "none", height: 0})),
        transition("show => hide", [style({overflow: "hidden"}), animate(250, style({height: 0}))]),
        transition("hide => show", [style({overflow: "hidden"}), animate(250, style({height: "*"}))])
    ])]
})
export class NavigationBar implements OnInit {
    @ViewChild("navbar") navbar: ElementRef;
    routes: Routes = appRoutes;

    ngOnInit(): void {
        scrollBar(this.navbar.nativeElement, "minimal-dark", "y");
    }
}

/* tslint:disable */
function scrollBar(selector, theme: string, mousewheelaxis: string): void {
    const $: any = window["$"];

    if (!$("html").hasClass("ismobile")) {
        $(selector).mCustomScrollbar({
            theme: theme,
            scrollInertia: 100,
            axis: "mousewheelaxis",
            mouseWheel: {
                enable: true,
                axis: mousewheelaxis,
                preventDefault: true
            }
        });
    }
}
/* tslint:enable */

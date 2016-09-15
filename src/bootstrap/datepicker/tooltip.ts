import * as ng from "@angular/core";
import {ComponentRef} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {of} from "rxjs/observable/of";
import {empty} from "rxjs/observable/empty";
import {fromPromise} from "rxjs/observable/fromPromise";
import {TimerObservable} from "rxjs/observable/TimerObservable";

export let TOOLTIP_ARGS: any = new ng.OpaqueToken("tooltipArgs");

@ng.Directive({
    selector: "[tooltip]",
    inputs: ["tool" + "tip"]
})
export class Tooltip implements ng.OnInit {
    @ng.Input("tooltip-args") tooltipDep: any;

    @ng.Input("trigger") trigger: string;
    @ng.Input("placement") placement: string = "right";
    @ng.Output("tooltipCtrl") tooltipCtrl: ng.EventEmitter<Tooltip> = new ng.EventEmitter<Tooltip>();
    tooltipContent: any;
    private controller: PopoverElement;

    constructor (private cr: ng.ComponentResolver,
                 private vcr: ng.ViewContainerRef) {
    }

    ngOnInit (): void {
        this.tooltipCtrl.emit(this);
    }

    public show (): void {
        if (!isBlank(this.controller)) {
            return;
        }

        // Why delay?
        // Trick to be sure that other Input properties are set
        TimerObservable.create(10).subscribe(() => {
            let tooltip: any = this.tooltipContent;
            if (isBlank(tooltip)) {
                return empty<PopoverElement>();
            }

            let controller: Observable<PopoverElement> = empty<PopoverElement>();

            if (tooltip instanceof ng.TemplateRef) {
                let ref: ng.EmbeddedViewRef<any> = this.vcr.createEmbeddedView(tooltip);
                let parent: any = document.createElement("div");
                forEach(ref.rootNodes, (el: HTMLElement) => {
                    el.remove();
                    parent.appendChild(el);
                });
                controller = this._show(parent);
            } else if (isElement(tooltip)) {
                const el: HTMLElement = <HTMLElement> tooltip;
                el.remove();
                controller = this._show(el);
            } else {

                let injector: any = this.vcr.injector;
                if (!isBlank(this.tooltipDep)) {
                    injector = ng.ReflectiveInjector.fromResolvedProviders(
                        ng.ReflectiveInjector.resolve([{provide: TOOLTIP_ARGS, useValue: this.tooltipDep}]), injector);
                }

                controller = fromPromise(this.cr.resolveComponent(tooltip)
                    .then((factory: ng.ComponentFactory<any>) => {
                        return factory.create(injector);
                    }))
                    .mergeMap((component: ComponentRef<any>) => {
                        return this._show(component.location.nativeElement);
                    });
            }

            return controller;

        });
    }

    hide (): void {
        if (this.controller) {
            this.controller.hide();
        }
    }

    set tooltip (tooltip: any) {
        this.tooltipContent = tooltip;
        this.show();
    }

    _show (element: any): Observable<PopoverElement> {
        let popover: JQuery = $(this.vcr.element.nativeElement).popover({
            trigger: this.trigger || "click hover focus",
            html: true,
            content: element,
            placement: this.placement,
            animation: true
        });
        let controller: any = {
            show: () => {
                popover.popover("show");
            },
            hide: () => {
                popover.popover("hide");
                // Clear click state
                // Fix issue when popover wont hide after manual hide
                $(popover).each(function (): void {
                    $(this).data("bs.popover").inState.click = false;
                });
            },
            destroy: () => {
                this.controller = undefined;
                popover.popover("destroy");
            },
            onHide: (callback: () => any) => {
                popover.on("hidden.bs.popover", callback);
            },
            onShow: (callback: () => any) => {
                popover.on("shown.bs.popover", callback);
            }
        };
        return of(this.controller = <PopoverElement>controller);
    }

}

export function isBlank (obj: any): boolean {
    return obj === undefined || obj === null;
}

export function forEach (obj: any, callback: (v: any, k: string) => void): void {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            callback(obj[key], key);
        }
    }
}

export function isElement (o: any): boolean {
    return typeof HTMLElement === "object"
        ? o instanceof HTMLElement
        : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
}

export interface PopoverElement {
    show(): void;
    hide(): void;
    destroy(): void;
    onShow(callback: () => any): void;
    onHide(callback: () => any): void;
}

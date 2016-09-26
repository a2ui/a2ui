import {Observable} from "rxjs/Rx";
import {of} from "rxjs/observable/of";
import {empty} from "rxjs/observable/empty";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {
    OpaqueToken, Directive, OnInit, EventEmitter, ComponentFactoryResolver, ViewContainerRef,
    TemplateRef, EmbeddedViewRef, ReflectiveInjector, Input, Output
} from "@angular/core";

export let TOOLTIP_ARGS: any = new OpaqueToken("tooltipArgs");

@Directive({
    selector: "[tooltip]",
    inputs: ["tool" + "tip"]
})
export class Tooltip implements OnInit {
    @Input("tooltip-args") tooltipDep: any;

    @Input("trigger") trigger: string;
    @Input("placement") placement: string = "right";
    @Output("tooltipCtrl") tooltipCtrl: EventEmitter<Tooltip> = new EventEmitter<Tooltip>();
    tooltipContent: any;
    private controller: PopoverElement;

    constructor (private cr: ComponentFactoryResolver,
                 private vcr: ViewContainerRef) {
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

            if (tooltip instanceof TemplateRef) {
                let ref: EmbeddedViewRef<any> = this.vcr.createEmbeddedView(tooltip);
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
                    injector = ReflectiveInjector.fromResolvedProviders(
                        ReflectiveInjector.resolve([{provide: TOOLTIP_ARGS, useValue: this.tooltipDep}]), injector);
                }

                this._show(this.cr.resolveComponentFactory(tooltip).create(injector).location.nativeElement);
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

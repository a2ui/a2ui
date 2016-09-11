import {
    Directive, Type, ComponentRef, ViewContainerRef, Injector, ComponentFactory,
    ReflectiveInjector, ComponentFactoryResolver
} from "@angular/core";
import {ConcreteType} from "@angular/core/src/facade/lang";

// tslint:disable-next-line
const $: any = window["$"];

@Directive({
    selector: "[a2Popover]",
    exportAs: "popover",
    inputs: ["options: a2Popover"]
})
export class PopoverDirective {
    options: {type?: ConcreteType<any>, provides?: Array<any>, bs?: any};
    private shown: boolean = false;
    private popover: any;
    private component: ComponentRef<any>;

    constructor(private vcr: ViewContainerRef,
                private componentResolver: ComponentFactoryResolver,
                private injector: Injector) {
    }

    toggle(): void {
        if (this.shown) {
            this.destroy();
        } else {
            this.show();
        }
    }

    show(): void {
        if (this.shown) {
            return;
        }
        this.shown = true;

        this.createComponent().then((content: any) => {
            let opts: any = {};
            let bs: any = this.options.bs || {};
            opts.animation = bs.animation;
            opts.container = bs.container;
            opts.delay = bs.delay;
            opts.html = bs.html || true;
            opts.content = content;
            opts.placement = bs.placement;
            opts.selector = bs.selector;
            opts.template = bs.template;
            opts.title = bs.title;
            opts.trigger = bs.trigger;
            opts.viewport = bs.viewport;

            this.popover = $(this.vcr.element.nativeElement).popover(opts);
            this.popover.popover("show");
            this.popover.on("hidden.bs.popover", () => {
                if (this.component) {
                    this.component.destroy();
                    this.component = undefined;
                }
            });
        });
    }

    destroy(): void {
        if (!this.shown) {
            return;
        }
        this.shown = false;

        this.popover.popover("destroy");
    }

    createComponent(): Promise<any> {
        if (this.options.bs.content) {
            return Promise.resolve(this.options.bs.content);
        }
        return this.factory(this.options.type, this.options.provides)
            .then((component: ComponentRef<any>) => {
                this.component = component;
                return component.location.nativeElement;
            });
    }

    private factory(component: ConcreteType<any>, providers: Array<Type | any[] | any> = []): Promise<ComponentRef<any>> {
        if (!Array.isArray(providers)) {
            providers = [providers];
        }
        let injector: ReflectiveInjector = ReflectiveInjector.fromResolvedProviders(
            ReflectiveInjector.resolve(providers), this.injector);
        let componentFactory: ComponentFactory<any> = this.componentResolver.resolveComponentFactory(component);
        return Promise.resolve(this.vcr.createComponent(componentFactory, undefined, injector));
    };
}

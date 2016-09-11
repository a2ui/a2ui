import {
    Injectable,
    ViewContainerRef,
    Injector,
    ApplicationRef,
    ComponentRef,
    Type,
    ComponentFactory,
    ReflectiveInjector,
    ComponentFactoryResolver
} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/share";
import "rxjs/add/operator/cache";
import {ConcreteType} from "@angular/core/src/facade/lang";

type ModalBackdrop = "static" | boolean;

@Injectable()
export class Modal {

    constructor(private injector: Injector,
                private componentResolver: ComponentFactoryResolver,
                private appRef: ApplicationRef) {
    }

    create({
        component, providers = [],
        modalParentSelector,
        keyboard = true,
        show = true,
        backdrop = true
    }: ModalOptions): Observable<ModalInstance> {
        const instanceSubject: Subject<ModalInstance> = new Subject<ModalInstance>();
        const resultSubject: Subject<ModalInstance> = new Subject<ModalInstance>();

        let modalActions: ModalActions = new ModalActions(resultSubject);
        providers.push({provide: ModalActions, useValue: modalActions});

        this.createComponent(component, providers).then((componentRef: ComponentRef<any>) => {
            let modalParent: Element;

            if (modalParentSelector !== undefined) {

                modalParent = document.querySelector(modalParentSelector);

                // tslint:disable-next-line
                if (modalParent === undefined || modalParent === null) {
                    instanceSubject.error("Can not find parent for modal using query: " + modalParentSelector);
                    return;
                }

            } else {
                modalParent = this.getAppRef().element.nativeElement;
            }

            modalParent.appendChild(componentRef.location.nativeElement);

            // tslint:disable-next-line
            let popup: any = (<any>window["$"](componentRef.location.nativeElement.childNodes[0]));
            let popupModal: any = popup.modal({keyboard, show, backdrop});


            let destroy: () => void = () => {
                if (!modalActions.destroyed) {
                    modalActions.destroyed = true;
                    popupModal.modal("hide").data("bs.modal", undefined);
                    componentRef.destroy();
                }
            };

            let bsDestroyEventHandler: () => void = () => {
                if (!modalActions.destroyed) {
                    destroy();
                    modalActions.close(undefined);
                }
            };

            popupModal.on("hidden.bs.modal", bsDestroyEventHandler);

            resultSubject.subscribe(destroy, destroy, destroy);

            instanceSubject.next({
                jqueryElement: popupModal,
                result: resultSubject,
                discard: modalActions.discard,
                close: modalActions.close,
                error: modalActions.error
            });
        });

        return instanceSubject;
    }

    private createComponent(component: ConcreteType<any>, providers: Array<Type | any[] | any>): Promise<ComponentRef<any>> {
        let injector: ReflectiveInjector = ReflectiveInjector.fromResolvedProviders(
            ReflectiveInjector.resolve(providers), this.injector);
        let componentFactory: ComponentFactory<any> = this.componentResolver.resolveComponentFactory(component);
        return Promise.resolve(this.getAppRef().createComponent(componentFactory, undefined, injector));
    };

    private getAppRef(): ViewContainerRef {
        // Hack, until fix:
        // https://github.com/angular/angular/issues/9293
        // tslint:disable-next-line
        return <ViewContainerRef>this.appRef["_rootComponents"][0]["_hostElement"].vcRef;
    }
}

export interface ModalOptions {
    component: ConcreteType<any>;
    providers?: Array<Type | any[] | any>;
    modalParentSelector?: string;
    backdrop?: ModalBackdrop;
    show?: boolean;
    keyboard?: boolean;
}

export interface ModalInstance {
    jqueryElement: any;
    result: Observable<any>;
    discard (): void;
    close (val: any): void;
    error (val: any): void;
}

export class ModalActions {
    constructor(private sub: Subject<any>,
                public destroyed: boolean = false) {
    }

    discard(): void {
        this.sub.complete();
    };

    close(val: any): void {
        this.sub.next(val);
        this.sub.complete();
    };

    error(val: any): void {
        this.sub.error(val);
    }
}

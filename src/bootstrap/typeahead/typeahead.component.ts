import {
    Type,
    ComponentRef,
    ReflectiveInjector,
    Directive,
    Injector,
    ComponentFactory,
    OnInit,
    Input,
    Injectable,
    ElementRef,
    HostListener,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ViewContainerRef,
    Output,
    EventEmitter,
    Host,
    Renderer
} from "@angular/core";
import {Observable, Subject} from "rxjs/Rx";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/filter";
import {SuggestionsComponent} from "./hints.component";
import {Hint} from "./hint.directive";

export type AutocompleteSupplier = (term: string) => Observable<Array<any>>;

@Directive({
    selector: "[a2ui-typeahead]",
    exportAs: "a2ui-typeahead"
})
@Injectable()
export class TypeaheadComponent implements OnInit {

    @Input() minChars: number = 3;

    @Input() minResults: number = 1;

    @Input() debounceTime: number = 200;

    @Input() supplier: AutocompleteSupplier;

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);

    items: Array<any>;

    dataStream: Subject<string> = new Subject<string>();

    suggestionsComponent: ComponentRef<SuggestionsComponent>;

    constructor(@Host() private hostingElement: ElementRef,
                private renderer: Renderer,
                private cd: ChangeDetectorRef,
                private viewContainerRef: ViewContainerRef,
                private componentResolver: ComponentFactoryResolver,
                private injector: Injector) {
    }


    @HostListener("keyup", ["$event.keyCode"]) onchange(key: number): void {
        this.dataStream.next(this.hostingElement.nativeElement.value);
        if (this.suggestionsComponent && this.suggestionsComponent.instance.hasItems()) {
            this.suggestionsComponent.instance.onKeyDown(key);
        }
    }

    @HostListener("focus") focus(): void {
        if (this.suggestionsComponent) this.suggestionsComponent.instance.hide();
    }

    ngOnInit(): void {
        let inputNotNullOrEmpty: (input: string) => boolean = (input: string) => input && input.trim().length > this.minChars;
        let resultsExist: (input: Array<any>) => boolean = (input: Array<any>) => input && input.length > this.minResults;
        let self: TypeaheadComponent = this;

        this.dataStream
            .debounceTime(this.debounceTime)
            .distinctUntilChanged()
            .filter(inputNotNullOrEmpty)
            .flatMap(this.supplier)
            .filter(resultsExist)
            .subscribe(onInputReceived);

        function onInputReceived(received: Array<any>): void {
            self.cd.markForCheck();

            getSuggestionsComponent()
                .then(attachAndPositionSuggestions)
                .then(initializeItems);

            function getSuggestionsComponent(): Promise<ComponentRef<SuggestionsComponent>> {
                if (!self.suggestionsComponent) {
                    return self.factory(SuggestionsComponent, [Hint])
                               .then(cref => {
                                   self.suggestionsComponent = cref;
                                   return cref;
                               });
                } else {
                    return Promise.resolve(self.suggestionsComponent);
                }
            }

            function initializeItems(cref: ComponentRef<SuggestionsComponent>): ComponentRef<SuggestionsComponent> {
                cref.instance.items = received;
                cref.instance.selectHint.subscribe(hint => onSelectedHint(hint));
                return cref;
            }

            function attachAndPositionSuggestions(cref: ComponentRef<SuggestionsComponent>): ComponentRef<SuggestionsComponent> {
                self.hostingElement.nativeElement.parentElement.appendChild(cref.location.nativeElement);
                TypeaheadComponent.positionTypeaheadList(self.hostingElement.nativeElement, cref.location.nativeElement);
                return cref;
            }

            function onSelectedHint(data: any): void {
                self.ngModelChange.emit(data);
                self.renderer.invokeElementMethod(self.hostingElement.nativeElement, "focus", []);
            }
        }
    }

    static positionTypeaheadList(parent: any, list: any): void {
        let style: CSSStyleDeclaration = list.style;
        style.top = parent.offsetTop + parent.offsetHeight + 3 + "";
        style.left = parent.offsetLeft + "";
        style.position = "absolute";
    }

    private factory(component: Type<any>, providers: Array<Type<any>> = []): Promise<ComponentRef<any>> {
        let injector: ReflectiveInjector = ReflectiveInjector.fromResolvedProviders(
            ReflectiveInjector.resolve(providers), this.injector);
        let componentFactory: ComponentFactory<any> = this.componentResolver.resolveComponentFactory(component);
        return Promise.resolve(this.viewContainerRef.createComponent(componentFactory, undefined, injector));
    };
}

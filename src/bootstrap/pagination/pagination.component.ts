import {
    Component,
    Directive,
    TemplateRef,
    forwardRef,
    ContentChild,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
    EventEmitter
} from "@angular/core";

@Component({
    selector: "a2-pagination",
    templateUrl: "src/bootstrap/pagination/pagination.component.html",
})
export class Pagination implements OnChanges {

    @Input()
    public data: Array<any>;
    @Input()
    public varName: string = "var";
    @Input()
    public availablePageSizes: number[];
    @Input()
    public selectedPageSize: number = 10;
    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter<number>();
    @ContentChild(forwardRef(() => PageTemplate))
    private pageTemplate: PageTemplate;

    private currentPage: number = 0;
    private pages: Array<number>;
    private pageContext: any = {};

    ngOnChanges(changes: SimpleChanges): any {
        if (changes.hasOwnProperty("data") || changes.hasOwnProperty("selectedPageSize")) {
            this.rescalePages();
        }
    }

    private rescalePages(): void {
        this.pages = Array(Math.ceil(this.data.length / this.selectedPageSize));
        this.open(0);
    }

    private preparePageContext(): any {
        this.pageContext[this.varName] = this.data.slice(this.currentPage * this.selectedPageSize,
            this.currentPage * this.selectedPageSize + this.selectedPageSize);
        return this.pageContext;
    }

    private changePageSize(newPageSize: number): void {
        this.selectedPageSize = newPageSize;
        this.rescalePages();
    }

    private open(pageNumber: number): void {
        this.currentPage = pageNumber;
        this.pageChange.emit(this.currentPage);
    }

    private openNext(): void {
        if (this.hasNext()) {
            this.open(this.currentPage + 1);
        }
    }

    private openPrevious(): void {
        if (this.hasPrev()) {
            this.open(this.currentPage - 1);
        }
    }

    private openFirst(): void {
        this.open(0);
    }

    private openLast(): void {
        this.open(this.pages.length - 1);
    }

    private hasNext(): boolean {
        return this.currentPage + 1 < this.pages.length;
    }

    private hasPrev(): boolean {
        return this.currentPage > 0;
    }
}

@Directive({
    selector: "template[pageTemplate]"
})
export class PageTemplate {
    constructor(public templateRef: TemplateRef<any>) {
    }
}

export const PAGINATION_DIRECTIVES: Array<any> = [Pagination, PageTemplate];

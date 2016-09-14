import {
    Component,
    Directive,
    TemplateRef,
    forwardRef,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    OnChanges, OnInit, IterableDiffers, DoCheck, SimpleChanges
} from "@angular/core";

@Component({
    selector: "a2-pagination",
    templateUrl: "src/bootstrap/pagination/pagination.component.html",
})
export class Pagination implements OnInit, DoCheck, OnChanges {

    @Input() availablePageSizes: number[];
    @Input() selectedPageSize: number = 10;
    @Input() lazy: boolean = false;
    @Input() pager: string;
    @Input() maxVisiblePages: number = 5;
    @Input() filterFunction: (data: Array<any>, restraints: Restraints) => Array<any> = (d, r) => {return d};
    @Input() sortFunction: (data: Array<any>, restraints: Restraints) => Array<any> = (d, r) => {return d};

    @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() public onLazy: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();

    @ContentChild(forwardRef(() => PageTemplate)) private pageTemplate: PageTemplate;

    private _data: Array<any>;
    private dataToDisplay: Array<any>;
    private totalRows: number;
    private currentPage: number = 0;
    private pages: Array<number> = [];
    private pageContext: PageContext = {
        restraints: {
            custom: {},
            filterBy: {}
        }
    };
    private differ: any;

    constructor(differs: IterableDiffers) {
        this.differ = differs.find([]).create(null);
        this.shiftVisiblePages();
    }

    @Input()
    set data(val: Array<any> | LazyPageData) {
        let previousPageCount: number = this.getPageCount();
        this._data = (val instanceof Array) ? val : (<LazyPageData>val).data;

        // TODO: simplify
        if (this.lazy) {
            this.dataToDisplay = this._data;
            this.totalRows = (<LazyPageData>val).totalRows;

            if (previousPageCount != this.getPageCount()) {
                if (this.currentPage > this.getPageCount() - 1) {
                    // Case when pagination requested page that didn't exists anymore
                    this.openLast();
                    return;
                } else {
                    this.shiftVisiblePages();
                }
            }

            if (this.differ.diff(this._data)) {
                this.preparePageContext();
                this.shiftVisiblePages();
            }
        } else {
            if (this.differ.diff(this._data)) {
                this.dataToDisplay = this.sortFunction(this.filterFunction(this._data, this.pageContext.restraints), this.pageContext.restraints);
                this.totalRows = this.dataToDisplay.length;
                this.preparePageContext();
                this.shiftVisiblePages();
            }
            if (this.currentPage > this.getPageCount() - 1) {
                this.openLast();
            }
        }
    }

    ngOnInit(): any {
        if (this.lazy) this.emitPageDataRequest();
    }

    ngDoCheck(): any {
        if (!this.lazy) this.data = this._data; //TODO Find better way to detect elements added/removed from array
    }

    ngOnChanges(changes: SimpleChanges): any {
        if ((changes.hasOwnProperty("selectedPageSize")) && this.totalRows && this._data.length > 0) {
            this.openFirst();
        }
    }

    filter(): void {
        if (!this.lazy) {
            this.dataToDisplay = this.sortFunction(this.filterFunction(this._data, this.pageContext.restraints), this.pageContext.restraints);
            this.totalRows = this.dataToDisplay.length
        }
        this.openFirst();
    }

    sort() {
        if(!this.lazy) this.sortFunction(this.dataToDisplay, this.pageContext.restraints);
        this.refresh();
    }

    refresh() {
        this.open(this.currentPage);
    }

    open(pageNumber: number): void {
        this.currentPage = pageNumber;
        this.lazy ? this.emitPageDataRequest() : this.preparePageContext();
        this.shiftVisiblePages();
        this.pageChange.emit(this.currentPage);
    }

    private shiftVisiblePages() {
        this.pages = [];
        let boundaries = this.calculatePaginationBoundaries();
        for (let i = boundaries[0]; i <= boundaries[1]; i++) {
            this.pages.push(i);
        }
    }

    private calculatePaginationBoundaries() {
        let visiblePages = Math.min(this.maxVisiblePages, this.getPageCount());
        let start = Math.max(0, this.currentPage - Math.floor(visiblePages / 2));
        let end = Math.min(this.getPageCount() - 1, start + visiblePages - 1);
        var delta = this.maxVisiblePages - (end - start + 1);
        start = Math.max(0, start - delta);
        return [start, end];
    }

    private preparePageContext(): any {
        this.pageContext.pageData = this.lazy ? this.dataToDisplay :
            this.dataToDisplay.slice(this.currentPage * this.selectedPageSize, this.currentPage * this.selectedPageSize + this.selectedPageSize);
    }

    private changePageSize(newPageSize: number): void {
        this.selectedPageSize = newPageSize;
        this.openFirst();
    }

    private emitPageDataRequest() {
        this.onLazy.emit({
            page: this.currentPage,
            rows: this.selectedPageSize,
            restraints: this.pageContext.restraints
        });
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
        this.open(this.getPageCount() - 1);
    }

    private hasNext(): boolean {
        return this.currentPage + 1 < this.getPageCount();
    }

    private hasPrev(): boolean {
        return this.currentPage > 0;
    }

    private getPageCount() {
        return Math.ceil(this.totalRows / this.selectedPageSize) || 1;
    }
}

@Directive({
    selector: "template[pageTemplate]"
})
export class PageTemplate {
    constructor(public templateRef: TemplateRef<any>) {
    }
}

export const PAGINATION_UI_DIRECTIVES: Array<any> = [Pagination, PageTemplate];

export interface LazyPageData {
    data: Array<any>;
    totalRows: number;
}

export interface LazyLoadEvent {
    page: number,
    rows: number,
    restraints: Restraints
}

export interface PageContext {
    pageData?: Array<any>,
    restraints: Restraints
}

export interface Restraints {
    custom: any,
    orderBy?: OrderMeta,
    filterBy: FilterMeta
}

export interface OrderMeta {
    field?: string;
    order?: number;
}

export interface FilterMeta {
    [filteredField: string]: string | number;
}

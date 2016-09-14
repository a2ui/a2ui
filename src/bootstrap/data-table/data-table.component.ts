import {
    Component,
    Input,
    Output,
    Directive,
    QueryList,
    EventEmitter,
    forwardRef,
    ContentChildren,
    AfterContentInit,
    ContentChild,
    ViewChild
} from "@angular/core";
import {NgClass} from "@angular/common";
import {
    PAGINATION_UI_DIRECTIVES, Pagination, LazyPageData, Restraints, LazyLoadEvent, OrderMeta
} from "../pagination/pagination.component";

@Component({
    selector: "a2-data-table",
    templateUrl: "src/bootstrap/data-table/data-table.component.html",
    directives: [PAGINATION_UI_DIRECTIVES, NgClass]
})
export class DataTable implements AfterContentInit {

    @Input() pageSize: number = 10;
    @Input() lazy: boolean = false;
    @Input() data: Array<any> | LazyPageData;
    @Input() selectionMode: string;
    @Input() selection: Array<any> = [];
    @Input() availablePageSizes: number[];
    @Input() tableClasses: string = "";

    @Output() onLazy: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();
    @Output() rowSelection: EventEmitter<SelectionEvent> = new EventEmitter<SelectionEvent>();
    @Output() rowEdit: EventEmitter<EditEvent> = new EventEmitter<EditEvent>();
    @ContentChildren(forwardRef(() => Column)) private columns: QueryList<Column>;
    @ContentChild(forwardRef(() => Header)) private header: Header;
    @ContentChild(forwardRef(() => Footer)) private footer: Footer;

    @ViewChild("paginator") private paginator: Pagination;
    private currentSortedColumn: Column;

    private filterFunction: Function = (data: any, restraints: Restraints) => {
        return data.filter(row => {
            let fulfilled: boolean = true;
            for (let key in restraints.filterBy) {
                if (restraints.filterBy.hasOwnProperty(key)) {
                    fulfilled = fulfilled && this.valueOf(row, key).includes(restraints.filterBy[key]);
                }
            }
            return fulfilled;
        });
    };

    private sortFunction = (data: any, restraints: Restraints) => {
        let orderBy: OrderMeta = restraints.orderBy;
        if (!orderBy) return data;
        data.sort((a, b) => this.alphabeticalSort(this.valueOf(a, orderBy.field), this.valueOf(b, orderBy.field), orderBy.order));
        return data;
    };
    
    ngAfterContentInit(): any {
        if (this.isSingleSelectionMode() && this.selection.length > 1) {
            this.selection.splice(1, this.selection.length - 1);
        }
    }
    
    private sort(restraints: Restraints, column: Column): void {
        if (column.sortBy === undefined) return;
        this.currentSortedColumn = column;
        restraints.orderBy = {field: column.content, order: column.order};
        this.paginator.sort();
        column.order = column.order * -1;
    }

    private alphabeticalSort(value1: any, value2: any, order: number): number {
        let result: number = 0;
        if (value1 instanceof String && value2 instanceof String) {
            result = value1.localeCompare(value2);
        } else {
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
        }
        return result * order;
    }

    private valueOf(root: any, path: string): any {
        let value: any = root;
        path.split(".").forEach(field => {
            value = value[field];
        });
        return value;
    }

    private handleRowClick(row: any): void {
        if (this.isOneClickSelectionMode()) {
            this.select(row);
        }
    }

    private handleRowDblClick(row: any): void {
        if (this.isDoubleClickSelectionMode()) {
            this.select(row);
        }
    }

    private select(row: any): void {
        let selectedRow: any;
        let unselectedRow: any;

        if (this.isSingleSelectionMode()) {
            //TODO Consider cleaning selection array after selection mode change
            this.selection.splice(0, this.selection.length);
            if (this.isDoubleClickSelectionMode()) {
                selectedRow = row;
                unselectedRow = undefined;
            } else {
                unselectedRow = this.selection[0];
                this.selection.splice(0, this.selection.length);
                if (this.selection[0] !== row) {
                    this.selection.push(row);
                    selectedRow = row;
                }
            }
        } else if (this.isMultiSelectionMode()) {
            let index: number = this.selection.indexOf(row);
            if (index !== -1) {
                unselectedRow = this.selection.splice(index, 1);
            } else {
                this.selection.push(row);
                selectedRow = row;
            }
        }
        this.rowSelection.emit({selected: selectedRow, unselected: unselectedRow});
    }

    private edit(event: any, column: Column, row: any): void {
        let value: any = row;
        let paths: Array<string> = column.content.split(".");
        while (paths.length > 0) {
            let path: string = paths.shift();
            if(paths.length !== 0) {
                value = value[path];
            } else {
                this.rowEdit.emit({editedRow: row, editedField: column.content, oldValue:value[path], newValue: event});
                value[path] = event;
            }
        }
    }

    private handleLazyLoading(event: LazyLoadEvent) {
        this.onLazy.emit(event);
    }

    private isSingleSelectionMode(): boolean {
        return this.selectionMode === "single" || this.selectionMode === "dblclick";
    }

    private isMultiSelectionMode(): boolean {
        return this.selectionMode === "multi";
    }

    private isDoubleClickSelectionMode(): boolean {
        return this.selectionMode === "dblclick";
    }

    private isSelectionMode(): boolean {
        return this.isOneClickSelectionMode() || this.isDoubleClickSelectionMode();
    }

    private isOneClickSelectionMode(): boolean {
        return this.selectionMode === "multi" || this.selectionMode === "single";
    }

    private getTableClass(): string {
        let tableClasses: string = "table " + this.tableClasses;

        if (this.isSelectionMode()) {
            tableClasses += " table-hover";
        }
        return tableClasses;
    }

    private getSortClass(column: Column): string {
        return "glyphicon glyphicon-" + ((column === this.currentSortedColumn) ?
            column.order === 1 ? "sort-by-attributes-alt" : "sort-by-attributes" : "sort");
    }

    private isSelected(row: any): boolean {
        return this.isOneClickSelectionMode() ? this.selection.indexOf(row) !== -1 : false;
    }
}


@Directive({
    selector: "a2-column",
})
export class Column {
    @Input() header: string;
    @Input() content: string;
    @Input() sortBy: string;
    @Input() filterBy: string;
    @Input() editable: boolean;

    order: number = 1;
}

@Component({
    selector: "a2-header",
    template: "<ng-content></ng-content>"
})
export class Header {
}

@Component({
    selector: "a2-footer",
    template: "<ng-content></ng-content>"
})
export class Footer {
}

export interface SelectionEvent {
    selected?: any;
    unselected?: any;
}

export interface EditEvent {
    editedRow: any;
    editedField: string;
    oldValue: any;
    newValue: any;
}
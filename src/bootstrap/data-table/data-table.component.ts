import {Component, Input, Output, Directive, QueryList, forwardRef, ContentChildren, AfterContentInit, ContentChild, EventEmitter} from "@angular/core";
import {NgClass} from "@angular/common";
import {PAGINATION_DIRECTIVES} from "../pagination/pagination.component";

@Component({
    selector: "a2-data-table",
    templateUrl: "src/bootstrap/data-table/data-table.component.html",
    directives: [PAGINATION_DIRECTIVES, NgClass]
})
export class DataTable implements AfterContentInit {
    pageSize: number = 5;
    @Input()
    public data: Array<any>;
    @Input()
    public selectionMode: string;
    @Input()
    public selection: Array<any> = [];
    @Input()
    public availablePageSizes: number[];
    @Output()
    public rowSelection: EventEmitter<any> = new EventEmitter<any>();
    @ContentChildren(forwardRef(() => Column))
    private columns: QueryList<Column>;
    @ContentChild(forwardRef(() => Header))
    private header: Header;
    @ContentChild(forwardRef(() => Footer))
    private footer: Footer;

    private dataToDisplay: Array<any>;
    private filters: any = {};

    ngAfterContentInit(): any {
        this.dataToDisplay = this.data.slice();
        if (this.isSingleSelectionMode() && this.selection.length > 1) {
            this.selection.splice(1, this.selection.length - 1);
        }
    }

    private filter(): void {
        this.dataToDisplay = this.data.filter(row => {
            let fulfilled: boolean = true;
            for (let key in this.filters) {
                if (this.filters.hasOwnProperty(key)) {
                    fulfilled = fulfilled && this.valueOf(row, key).includes(this.filters[key]);
                }
            }
            return fulfilled;
        });
    }

    private orderBy(column: Column): void {
        if (column.sortBy === undefined) return;
        this.dataToDisplay.sort((a, b) => this.alphabeticalSort(this.valueOf(a, column.sortBy), this.valueOf(b, column.sortBy), column.order));
        column.order = column.order * -1;
    }

    private alphabeticalSort(a: any, b: any, order: number): number {
        if (a < b) return -1 * order;
        if (a > b) return order;
        return 0;
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
        if (this.isSingleSelectionMode()) {
            let current: any = this.selection[0];
            this.selection.splice(0, this.selection.length);
            if (this.isDoubleClickSelectionMode() || current !== row) {
                this.selection.push(row);
            }
        } else if (this.isMultiSelectionMode()) {
            let index: number = this.selection.indexOf(row);
            index !== -1 ? this.selection.splice(index, 1) : this.selection.push(row);
        }
        this.rowSelection.emit(this.selection);
    }

    private edit(event: any, column: Column, row: any): void {
        let value: any = row;
        let paths: Array<string> = column.content.split(".");
        while (paths.length > 0) {
            let path: string = paths.shift();
            paths.length !== 0 ? value = value[path] : value[path] = event;
        }
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

    private getTableStyle(): string {
        let tableClasses: string = "table";

        if (this.isSelectionMode()) {
            tableClasses += " table-hover";
        }
        return tableClasses;
    }

    private isSelected(row: any): boolean {
        return this.isOneClickSelectionMode() ? this.selection.indexOf(row) !== -1 : false;
    }
}


@Directive({
    selector: "a2-column",
})
export class Column {
    @Input()
    public header: string;
    @Input()
    public content: string;
    @Input()
    public sortBy: string;
    @Input()
    public filterBy: string;
    @Input()
    public editable: boolean;

    public order: number = 1;
}

@Component({
    selector: "a2-header",
    template: "<ng-content></ng-content>"
})
export class Header {}

@Component({
    selector: "a2-footer",
    template: "<ng-content></ng-content>"
})
export class Footer {}

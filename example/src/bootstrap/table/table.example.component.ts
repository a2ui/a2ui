import {Component} from "@angular/core";
import {LazyPageData, Restraints, LazyLoadEvent} from "a2ui/bootstrap/pagination/pagination.component";
import {SelectionEvent, EditEvent} from "a2ui/bootstrap/data-table/data-table.component";

@Component({
    selector: "a2uie-table",
    templateUrl: "table.example.component.html"
})
export class TableExampleComponent {
    eagerTableData: Array<any> = [
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Einstein", age: "23", nested: {value: "Adventurer"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Egghead"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Zweitein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Dreitein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Viertein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Funftein", age: "23", nested: {value: "Egghead"}}
    ];

    editableTableData: Array<any> = [
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Einstein", age: "23", nested: {value: "Adventurer"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Egghead"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Zweitein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Dreitein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Viertein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Funftein", age: "23", nested: {value: "Egghead"}}
    ];

    lazyTableData: LazyPageData = <LazyPageData>{};
    selection: Array<any> = [];
    selectionEvent: SelectionEvent;
    editEvent: EditEvent;
    tableClasses: Array<any> = [];

    selectionType: any = "single";

    onRowSelect(event: SelectionEvent): void {
        this.selectionEvent = event;
    }

    onRowEdit(event: EditEvent): void {
        this.editEvent = event;
    }

    setSelectionMode(event: any): void {
        this.selectionType = event.value;
    }

    getClasses(): string {
        return this.tableClasses.join(" ");
    }

    initTableSelections(): void {
        this.selectionType = "multi";
        this.selection.length = 0;
        this.selection.push(this.eagerTableData[0]);
        this.selection.push(this.eagerTableData[3]);
        this.selection.push(this.eagerTableData[5]);
    }

    onLazy(event: LazyLoadEvent): void {
        setTimeout(() => {
            this.lazyTableData = FakeDatabaseService.loadData(this.eagerTableData, event);
        }, 1000);
    }
}

class FakeDatabaseService {
    static loadData(data: Array<any>, event: LazyLoadEvent): LazyPageData {
        let response: LazyPageData = <LazyPageData>{};
        let restrained: Array<any> = this.sortFunction(this.filterFunction(data, event.restraints), event.restraints);
        response.totalRows = restrained.length;
        response.data = restrained.slice(event.page * event.rows, event.page * event.rows + event.rows);
        return response;
    }

    static sortFunction(data: Array<any>, restraints: Restraints): Array<any> {
        if (!restraints.orderBy) return data;
        data.sort((a, b) => this.compare(this.valueOf(a, restraints.orderBy.field), this.valueOf(b, restraints.orderBy.field), restraints.orderBy.order));
        return data;
    }

    static filterFunction(data: Array<any>, restraints: Restraints): Array<any> {
        return data.filter(row => {
            let fulfilled: boolean = true;
            for (let key in restraints.filterBy) {
                if (restraints.filterBy.hasOwnProperty(key)) {
                    fulfilled = fulfilled && this.valueOf(row, key).includes(restraints.filterBy[key]);
                }
            }
            return fulfilled;
        });
    }

    static valueOf(root: any, path: string): any {
        let value: any = root;
        path.split(".").forEach(field => {
            value = value[field];
        });
        return value;
    }

    static compare(a: any, b: any, order: number): number {
        if (a < b) return -1 * order;
        if (a > b) return order;
        return 0;
    }
}

import {Component} from "@angular/core";

@Component({
    selector: "a2uie-table",
    templateUrl: "src/examples/bootstrap/table/table.example.component.html"
})
export class TableExampleComponent {
    tableData: Array<any> = [
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

    selectedRows: any = [this.tableData[0], this.tableData[2]];

    rowSelection(event: any): any {
    }
}

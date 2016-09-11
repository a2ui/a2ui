import {Component} from "@angular/core";

@Component({
    selector: "a2uie-pagination",
    templateUrl: "src/examples/bootstrap/pagination/pagination.example.component.html"
})
export class PaginationExampleComponent {
    pageSize: number = 3;
    current: number = 2;
    data: Array<any> = [
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Einstein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Zweitein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Dreitein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Viertein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Funftein", age: "23"}
    ];

}

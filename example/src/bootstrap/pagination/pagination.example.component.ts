import {Component, ViewChild} from "@angular/core";
import {LazyPageData, Pagination, Restraints, LazyLoadEvent} from "a2ui/bootstrap/pagination/pagination.component";

@Component({
    selector: "a2uie-pagination",
    templateUrl: "pagination.example.component.html"
})
export class PaginationExampleComponent {

    @ViewChild("lazyPaginator") lazyPaginator: Pagination;
    @ViewChild("eagerPaginator") eagerPaginator: Pagination;
    @ViewChild("eagerPaginatorCustom") eagerPaginatorCustom: Pagination;

    pageSize: number = 5;
    current: number = 2;
    lazyData: LazyPageData = <LazyPageData>{};
    lazyDataWithFiltering: LazyPageData = <LazyPageData>{};
    eagerData: Array<any> = [
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

    eagerOrder: number = 1;
    lazyOrder: number = 1;
    pagerType: string = "centered";

    changePagerType(): void {
        this.pagerType = this.pagerType === "centered" ? "aligned" : "centered";
    }

    sort(field: string, sortBy: Restraints): void {
        sortBy.orderBy = {field: field, order: this.eagerOrder};
        this.eagerPaginator.sort();
        this.eagerOrder = this.eagerOrder * -1;
    }

    sortLazy(field: string, sortBy: Restraints): void {
        sortBy.orderBy = {field: field, order: this.lazyOrder};
        this.lazyPaginator.sort();
        this.lazyOrder = this.lazyOrder * -1;
    }

    sortFunction = (data: any, restraints: Restraints) => {
        if (!restraints.orderBy) return data;
        data.sort((a, b) => this.alphabeticalCompare(a[restraints.orderBy.field], b[restraints.orderBy.field], restraints.orderBy.order));
        return data;
    };

    filterFunction: Function = (data: any, restraints: Restraints) => {
        return data.filter(row => {
            let fulfilled: boolean = true;
            for (let key in restraints.filterBy) {
                if (restraints.filterBy.hasOwnProperty(key)) {
                    fulfilled = fulfilled && row[key].includes(restraints.filterBy[key]);
                }
            }
            return fulfilled;
        });
    };

    filterFunctionWithCustomImpl: Function = (data: any, restraints: Restraints) => {
        return data.filter(row => {
            let fulfilled: boolean = true;
            for (let key in restraints.filterBy) {
                if (restraints.filterBy.hasOwnProperty(key)) {
                    fulfilled = fulfilled && row[key].includes(restraints.filterBy[key]);
                }
            }
            let searchElement: string = restraints.custom.allFieldsFilter || "";
            // tslint:disable-next-line
            fulfilled = fulfilled && row["surname"].includes(searchElement) && row["name"].includes(searchElement);
            return fulfilled;
        });
    };

    onLazy(event: LazyLoadEvent): void {
        setTimeout(() => {
            this.lazyData = FakeRepository.loadData(this.eagerData, event);
        }, 1000);
    }

    onLazyWithFiltering(event: LazyLoadEvent): void {
        setTimeout(() => {
            this.lazyDataWithFiltering = FakeRepository.loadData(this.eagerData, event);
        }, 1000);
    }

    private alphabeticalCompare(a: any, b: any, order: number): number {
        if (a < b) return -1 * order;
        if (a > b) return order;
        return 0;
    }
}

class FakeRepository {
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

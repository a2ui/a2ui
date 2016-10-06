---
layout: page
title: Pagination
root: false
permalink: /bootstrap/pagination
---

### Overview

# Inputs

<table>
    <tr>
        <th>Input</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>pageSize</td>
        <td>number</td>
        <td>10</td>
        <td>Defines number of elements per page.</td>
    </tr>
    <tr>
        <td>lazy</td>
        <td>boolean</td>
        <td>false</td>
        <td>Determines if page should loaded lazily</td>
    </tr>
    <tr>
        <td>data</td>
        <td>array or LazyPageData</td>
        <td>N/A</td>
        <td>Defines all data displayed or data displayed on current page in case of lazy loading. Pass array for eager pagination or LazyPageData in lazy case.
            LazyPageData contains array of data displayed on opened page and number of total rows.
        </td>
    </tr>
    <tr>
        <td>pager</td>
        <td>string</td>
        <td>N/A</td>
        <td>If defined enables bootstrap Pager style. Accepted values are 'aligned' and 'centered'.</td>
    </tr>
    <tr>
        <td>maxVisiblePages</td>
        <td>number</td>
        <td>5</td>
        <td>Defines number of displayed pages. maxVisiblePages = pages before current page + current page + pages after current page.</td>
    </tr>
    <tr>
        <td>filterFunction</td>
        <td>(data: Array&#60;any&#62;, restraints: Restraints) =&#62; Array&#60;any&#62;</td>
        <td>(d, r) =&#62; {return d; }</td>
        <td>Defines filtering function that should be used by pagination.</td>
    </tr>
    <tr>
        <td>sortFunction</td>
        <td>(data: Array&#60;any&#62;, restraints: Restraints) =&#62; Array&#60;any&#62;</td>
        <td>(d, r) =&#62; {return d; }</td>
        <td>Defines sorting function that should be used by pagination.</td>
    </tr>
</table>

# Outputs

<table>
    <tr>
        <th>Output</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>onLazy</td>
        <td>EventEmitter of LazyLoadEvent</td>
        <td>In case of lazy loading emits LazyLoadEvent that indicates new page data should be loaded.
        Event defines requested page, number of rows and additional restraints.        
        </td>
    </tr>
    <tr>
        <td>pageChange</td>
        <td>number</td>
        <td>Emits number of currently opened page.</td>
    </tr>
</table>

# Methods

<table>
    <tr>
        <th>Method</th>
        <th>Signature</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>filter</td>
        <td>filter(): void</td>
        <td>Triggers filtering.</td>
    </tr>
    <tr>
        <td>sort</td>
        <td>sort(): void</td>
        <td>Triggers sorting.</td>
    </tr>
    <tr>
        <td>refresh</td>
        <td>refresh(): void</td>
        <td>Refresh current page. Designed for lazy loading.</td>
    </tr>
    <tr>
        <td>open</td>
        <td>open(pageNumber: string): void</td>
        <td>Opens given page.</td>
    </tr>
</table>

# Defining page

To define page layout use pageTemplate selector. It also provides page context data 
which can be used by defining new variable and passing desired data to it:

{% highlight html %}

        <a2-pagination #eagerPaginator [data]="eagerData">
            <template pageTemplate let-persons="pageData" let-restraints="restraints">
                Filter oddities by name: <input [(ngModel)]="restraints.filterBy.name" (keyup)="eagerPaginator.filter()">
                <ul>
                    <li *ngFor="let person of persons">{{person.name}} {{person.surname}} age {{person.age}}</li>
                </ul>
            </template>
        </a2-pagination>
{% endhighlight %}


# Types

{% highlight ts %}
    export interface PageContext {
        pageData?: Array<any>;
        restraints: Restraints;
    }
{% endhighlight %}

**pageData** - contains sorted and filtered data for current page.

**restraints** - used for all kind of filtering and sorting. All data used in filter, 
sort functions and added to LazyLoadEvent should be passed here.

{% highlight ts %}
    export interface LazyPageData {
        data: Array<any>;
        totalRows: number;
    }
{% endhighlight %}

**data** - data to be displayed on current page

**totalRows** - number of total results for given restraints

{% highlight ts %}
    export interface LazyLoadEvent {
        page: number;
        rows: number;
        restraints: Restraints;
    }
{% endhighlight %}
**page** - requested page

**rows** - requested number of rows

**restraints** - data restraints (filtering and ordering)

{% highlight ts %} 
    export interface Restraints {
        custom: any;
        orderBy?: OrderMeta;
        filterBy: FilterMeta;
    }
{% endhighlight %}

**custom** - any custom data. For example data for multi field filtering.

**orderBy** - contains ordering information

**filterBy** - contains filtering information
  
{% highlight ts %}
    export interface OrderMeta {
        field?: string;
        order?: number;
    }
{% endhighlight %}

**field** - name of field to order by.

**order** - 1 for ASC and -1 for DESC

{% highlight ts %}
    export interface FilterMeta {
        [filteredField: string]: string | number;
    }
{% endhighlight %}

Contains filtering data. Field name indicates name of field that should be filtered.
Value contains filter value.

## Examples

HTML:
{% highlight html %}

<div class="card">

    <div class="card-header">
        <h2>Pagination</h2>
    </div>

    <div class="card-body card-padding">
        <a2-pagination [pageSize]="pageSize" [data]="eagerData">
            <template pageTemplate let-persons="pageData">
                    <ul>
                        <li *ngFor="let person of persons">{{person.name}} {{person.surname}} Age:{{person.age}}</li>
                    </ul>
            </template>
        </a2-pagination>
    </div>

    <div class="card-header">
        <h2>Pager</h2>
    </div>

    <button (click)="changePagerType()"> Change pager type</button><br/><br/>
    <div class="card-body card-padding">
        <a2-pagination [pageSize]="pageSize" [data]="eagerData" [pager]="pagerType" >
            <template pageTemplate let-persons="pageData">
                <ul>
                    <li *ngFor="let person of persons">{{person.name}} {{person.surname}} Age:{{person.age}}</li>
                </ul>
            </template>
        </a2-pagination>
    </div>

    <div class="card-header">
        <h2>Filtering and sorting</h2>
    </div>

    <div class="card-body card-padding">
        <a2-pagination #eagerPaginator [(pageSize)]="pageSize" [data]="eagerData" [availablePageSizes]="[5,10,15]"
                       [filterFunction]="filterFunction" [sortFunction]="sortFunction">
            <template pageTemplate let-persons="pageData" let-restraints="restraints">
                Filter oddities by name: <input [(ngModel)]="restraints.filterBy.name" (keyup)="eagerPaginator.filter()">
                <button (click)="sort('name', restraints)">Sort oddities {{eagerOrder === 1 ? 'ascending': 'descending'}} by name</button><br/><br/>
                <ul>
                    <li *ngFor="let person of persons">{{person.name}} {{person.surname}} age {{person.age}}</li>
                </ul>
            </template>
        </a2-pagination>
    </div>

    <div class="card-header">
        <h2>Lazy Pagination</h2>
    </div>

    <div class="card-body card-padding">
        <a2-pagination [(pageSize)]="pageSize" [data]="lazyData" [availablePageSizes]="[5,10,15]" (onLazy)="onLazy($event)" [lazy]="true">
            <template pageTemplate let-persons="pageData">
                <ul>
                    <li *ngFor="let person of persons">{{person.name}} {{person.surname}} age {{person.age}}</li>
                </ul>
            </template>
        </a2-pagination>
    </div>

    <div class="card-header">
        <h2>Lazy filtering and sorting</h2>
    </div>

    <div class="card-body card-padding">
        <a2-pagination #lazyPaginator [(pageSize)]="pageSize" [data]="lazyDataWithFiltering" [availablePageSizes]="[5,10,15]" (onLazy)="onLazyWithFiltering($event)" [lazy]="true">
            <template pageTemplate let-persons="pageData" let-restraints="restraints">
                Filter oddities by name: <input [(ngModel)]="restraints.filterBy.name" (keyup)="lazyPaginator.filter()">
                <button (click)="sortLazy('name', restraints)">Sort oddities {{lazyOrder === 1 ? 'ascending': 'descending'}} by name</button><br/><br/>
                <ul>
                    <li *ngFor="let person of persons">{{person.name}} {{person.surname}} Age:{{person.age}}</li>
                </ul>
            </template>
        </a2-pagination>
    </div>

    <div class="card-header">
        <h2>Custom filtering</h2>
    </div>

    <div class="card-body card-padding">
        <a2-pagination #eagerPaginatorCustom [(pageSize)]="pageSize" [data]="eagerData" [availablePageSizes]="[5,10,15]"
                       [filterFunction]="filterFunctionWithCustomImpl" [sortFunction]="sortFunction">
            <template pageTemplate let-persons="pageData" let-restraints="restraints">
                Filter oddities by name: <input [(ngModel)]="restraints.filterBy.name" (keyup)="eagerPaginatorCustom.filter()">
                Filter by name and surname:  <input [(ngModel)]="restraints.custom.allFieldsFilter" (keyup)="eagerPaginatorCustom.filter()">
                <ul>
                    <li *ngFor="let person of persons">{{person.name}} {{person.surname}} age {{person.age}}</li>
                </ul>
            </template>
        </a2-pagination>
    </div>
</div>


{% endhighlight %}

TypeScript:

{% highlight ts %}

@Component({
    selector: "a2uie-pagination",
    templateUrl: "src/examples/bootstrap/pagination/pagination.example.component.html"
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
            fulfilled = fulfilled && row["surname"].includes(searchElement) && row["name"].includes(searchElement);
            return fulfilled;
        });
    };

    onLazy(event: LazyLoadEvent): void {
        this.lazyData = FakeDatabaseService.loadData(event.page, event.rows, event.restraints);
    }

    onLazyWithFiltering(event: LazyLoadEvent): void {
        this.lazyDataWithFiltering = FakeDatabaseService.loadData(event.page, event.rows, event.restraints);
    }

    private alphabeticalCompare(a: any, b: any, order: number): number {
        if (a < b) return -1 * order;
        if (a > b) return order;
        return 0;
    }
}

{% endhighlight %}

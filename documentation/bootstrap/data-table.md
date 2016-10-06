---
layout: page
title: Data Table
root: false
permalink: /bootstrap/data-table
---

### Overview

Component which allow to create basic data tables in simple and clear way.


_New features will be implemented soon._

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
        <td>Determines if table should load data lazily</td>
    </tr>
    <tr>
        <td>data</td>
        <td>array or LazyPageData</td>
        <td>N/A</td>
        <td>Defines all data displayed in table or on current page in case of lazy loading. Pass array for eager table or LazyPageData in lazy case.
            LazyPageData contains array of data displayed on opened page and number of total rows.
        </td>
    </tr>
    <tr>
        <td>selectionMode</td>
        <td>string</td>
        <td>N/A</td>
        <td>If defined enables table row selection. Accepted values:
            <ul>
                <li>"single" allow to select single row. Fires SelectionEvent with selected and unselected row data and
                    highlights row.
                </li>
                <li>"multi" allow to select multiple rows. Fires SelectionEvent with selected or unselected row data and
                    highlights rows.
                </li>
                <li>"dblclick" allow to select single row by double click. Fires SelectionEvent with selected row data.
                </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>selection</td>
        <td>array</td>
        <td>N/A</td>
        <td>Defines initial selection. Can be used with single and multi mode</td>
    </tr>
    <tr>
        <td>availablePageSizes</td>
        <td>array of number</td>
        <td>N/A</td>
        <td>If defined table display option to select page size. selection=[5, 10, 15]</td>
    </tr>
    <tr>
        <td>tableClasses</td>
        <td>string</td>
        <td>.table</td>
        <td>Allow to define bootstrap table styles like .table-striped .table-bordered .table-hover .table-condensed
            .table-responsiv.
            It is possible to use multiple styles separated with spaces tableClasses="table-striped table-bordered
            table-hover" or use your own styles.
        </td>
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
        <td>rowSelection</td>
        <td>EventEmitter of SelectionEvent</td>
        <td>Emits SelectionEvent event when row is selected. Look selectionMode input for more details.</td>
    </tr>
    <tr>
        <td>rowEdit</td>
        <td>EventEmitter of EditEvent</td>
        <td>Emits EditEvent event when user edit cell. Contains edited row data, edited field name, old and new value.</td>
    </tr>
</table>

# Defining columns

Column definition is done by using a2-column selector.

<table>
    <tr>
        <th>Input</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>header</td>
        <td>string</td>
        <td>Defines column name</td>
    </tr>
    <tr>
        <td>content</td>
        <td>string</td>
        <td>Defines name of field which will be displayed in column.</td>
    </tr>
    <tr>
        <td>sortBy</td>
        <td>string</td>
        <td>If present enables sorting for given column. Defines name of field to sort by.</td>
    </tr>
    <tr>
        <td>filterBy</td>
        <td>number</td>
        <td>If present enables filtering for given column. Defines name of field to filter by.</td>
    </tr>
    <tr>
        <td>editable</td>
        <td>boolean</td>
        <td>If true enables value edition for given column.</td>
    </tr>
</table>

# Defining footer and header

Footer and header definition is done by using a2-header and a2-footer selectors.

{% highlight html %}

        <a2-data-table ...>
            <a2-header>
                <div class="text-center"><b><h3><i>Oddities</i></h3></b></div>
            </a2-header>
            
            //..
            
            <a2-footer><i style="color: #00AA00">Example footer content</i></a2-footer>

        </a2-data-table>

{% endhighlight %}

# Types

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
        orderBy?: OrderMeta;
        filterBy: FilterMeta;
    }
{% endhighlight %}

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
        <h2>Basic Table</h2>
    </div>

    Select table styles (You can select multiple with Ctrl):<br/>
    <select multiple [(ngModel)]="tableClasses">
        <option value="table-striped">Stripped</option>
        <option value="table-bordered">Bordered</option>
        <option value="table-hover">Hover</option>
        <option value="table-condensed">Condensed</option>
    </select>

    <div class="card-body card-padding">
        <a2-data-table [data]="eagerTableData" [availablePageSizes]="[5,10,15]" [pageSize]="5" [tableClasses]="getClasses()">
            <a2-header>
                <div class="text-center"><b><h3><i>Oddities</i></h3></b></div>
            </a2-header>
            <a2-column header="Name" content="name"></a2-column>
            <a2-column header="Surname" content="surname" ></a2-column>
            <a2-column header="Age" content="age"></a2-column>
            <a2-column header="Nested" content="nested.value"></a2-column>
            <a2-footer><i style="color: #00AA00">Example footer content</i></a2-footer>

        </a2-data-table>
    </div>

    <div class="card-header">
        <h2>Filtering and sorting</h2>
    </div>

    <div class="card-body card-padding">
        <a2-data-table [data]="eagerTableData" [availablePageSizes]="[5,10,15]" [pageSize]="5">
            <a2-header>
                <div class="text-center"><b><h3><i>Oddities</i></h3></b></div>
            </a2-header>
            <a2-column header="Name" content="name" sortBy="name" filterBy="name"></a2-column>
            <a2-column header="Surname" content="surname" sortBy="surname" filterBy="surname"></a2-column>
            <a2-column header="Age" content="age" sortBy="age" filterBy="age"></a2-column>
            <a2-column header="Nested" content="nested.value" sortBy="nested.value" filterBy="nested.value"></a2-column>
            <a2-footer><i>Example footer content</i></a2-footer>
        </a2-data-table>
    </div>

    <div class="card-header">
        <h2>Lazy Table</h2>
    </div>

    <div class="card-body card-padding">
        <a2-data-table [data]="lazyTableData" [availablePageSizes]="[5,10,15]" [pageSize]="5"
                       [lazy]="true" (onLazy)="onLazy($event)">
            <a2-header>
                <div class="text-center"><b><h3><i>Oddities</i></h3></b></div>
            </a2-header>
            <a2-column header="Name" content="name" sortBy="name" filterBy="name"></a2-column>
            <a2-column header="Surname" content="surname" sortBy="surname" filterBy="surname"></a2-column>
            <a2-column header="Age" content="age" sortBy="age" filterBy="age"></a2-column>
            <a2-column header="Nested" content="nested.value" sortBy="nested.value" filterBy="nested.value"></a2-column>
            <a2-footer><i>Example footer content</i></a2-footer>
        </a2-data-table>
    </div>

    <div class="card-header">
        <h2>Editable</h2>
    </div>

    <div class="card-body card-padding">
        <a2-data-table [data]="editableTableData" [availablePageSizes]="[5,10,15]" [pageSize]="5" (rowEdit)="onRowEdit($event)">
            <a2-header>
                <div class="text-center"><b><h3><i>Oddities</i></h3></b></div>
            </a2-header>
            <a2-column header="Name" content="name" sortBy="name" filterBy="name" [editable]="true"></a2-column>
            <a2-column header="Surname" content="surname" sortBy="surname" filterBy="surname"></a2-column>
            <a2-column header="Age" content="age" sortBy="age" filterBy="age"></a2-column>
            <a2-column header="Nested" content="nested.value" sortBy="nested.value" filterBy="nested.value"></a2-column>
            <a2-footer><i>Example footer content</i></a2-footer>
        </a2-data-table>
    </div>
    <b>Edit event:</b> <br/>{{editEvent | json}}<br/>
    <b>Input data:</b> <br/> {{editableTableData | json}}<br/>

    <div class="card-header">
        <h2>Selection</h2>
    </div>

    <div class="card-body card-padding">

        Selection type:
        <select [(ngModel)]="selectionType">
            <option value="single">Single</option>
            <option value="multi">Multi</option>
            <option value="dblclick">Double Click</option>
        </select>
        <br/>
        <br/>
        <button (click)="initTableSelections()">Init table with selections</button><br/><br/>

        <a2-data-table [data]="eagerTableData" [availablePageSizes]="[5,10,15]" [pageSize]="5"
                       [selectionMode]="selectionType"
                       [selection]="selection"
                       (rowSelection)="onRowSelect($event)">
            <a2-header>
                <div class="text-center"><b><h3><i>Oddities</i></h3></b></div>
            </a2-header>
            <a2-column header="Name" content="name" sortBy="name" filterBy="name"></a2-column>
            <a2-column header="Surname" content="surname" sortBy="surname" filterBy="surname"></a2-column>
            <a2-column header="Age" content="age" sortBy="age" filterBy="age"></a2-column>
            <a2-column header="Nested" content="nested.value" sortBy="nested.value" filterBy="nested.value"></a2-column>
            <a2-footer><i>Example footer content</i></a2-footer>
        </a2-data-table>
    </div>

    <b>Selection event:</b> <br/>{{selectionEvent | json}}<br/>
    <b>Selected elements:</b> <br/>{{selection | json}}<br/>
</div>

{% endhighlight %}

TypeScript:

{% highlight ts %}

@Component({
    selector: "a2uie-table",
    templateUrl: "src/examples/bootstrap/table/table.example.component.html"
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
            this.lazyTableData = FakeDatabaseService.loadData(event.page, event.rows, event.restraints);
    }
}

{% endhighlight %}

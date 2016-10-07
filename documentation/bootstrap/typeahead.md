---
layout: page
title: Typeahead
root: false
permalink: /bootstrap/typeahead
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
        <td>minChars</td>
        <td>number</td>
        <td>3</td>
        <td>Minimal characters count triggering hints lookup</td>
    </tr>
    <tr>
        <td>minResults</td>
        <td>number</td>
        <td>1</td>
        <td>Minimal results count for which hints are displayed</td>
    </tr>
    <tr>
        <td>debounceTime</td>
        <td>number</td>
        <td>200</td>
        <td>Debounce time for lookup trigger in ms</td>
    </tr>
    <tr>
        <td>supplier</td>
        <td>function</td>
        <td>N/A</td>
        <td>Function with string => Observable&#60;Array&#60;any&#62;&#62; that supplies hints data</td>
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
        <td>ngModelChange</td>
        <td>EventEmitter of any</td>
        <td>When hint is selected model change event is being emmited with selected value</td>
    </tr>
</table>

# Types
   
```typescript
    export type AutocompleteSupplier = (term: string) => Observable<Array<any>>;
```

# Examples

HTML:

```html
    <input a2ui-typeahead  
        [debounceTime]="500"
        [supplier]="wikiServiceProvider"
        [(ngModel)]="modelValue" 
        [ngModelOptions]="{standalone: true}">

```

TypeScript:

We define wikiServiceProvider ([thanks to Christoph Burgdorf's post on thoughtram.io](http://blog.thoughtram.io/angular/2016/01/06/taking-advantage-of-observables-in-angular2.html) - good read!) as follows

```typescript
    let wikiServiceProvider: AutocompleteSupplier = (term: string) => {
        let search: URLSearchParams = new URLSearchParams();
        search.set("action", "opensearch");
        search.set("search", term);
        search.set("format", "json");
        return this.jsonp
            .get("http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK", {search})
            .map(response => response.json()[1]);
    }
```
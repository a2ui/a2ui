See full documentation at [http://a2ui.codeweaver.pl](http://a2ui.codeweaver.pl)

# Speed up your Angular 2 applications development using:

# Utils:
* `ready` [Clipboard copy and cut](http://a2ui.codeweaver.pl/utils/copy-and-cut)
* `ready` [On initialize expression](http://a2ui.codeweaver.pl/utils/on-init)
* `ready` [Upload component](http://a2ui.codeweaver.pl/utils/upload)
* `ready` [File drag events](http://a2ui.codeweaver.pl/utils/file-drag-events)
* `ready` [Changes watcher](http://a2ui.codeweaver.pl/utils/watcher)
* Table helpers
* Validation helpers
* Utility pipes collection
* Http cache

# Bootstrap:
* `ready` [Accordion](http://a2ui.codeweaver.pl/bootstrap/accordion)
* `ready` [Alert](http://a2ui.codeweaver.pl/bootstrap/alert)
* `ready` [Date picker](http://a2ui.codeweaver.pl/bootstrap/date-picker)
* `ready` [Date time picker](http://a2ui.codeweaver.pl/bootstrap/date-time-picker)
* `ready` [Date range picker](http://a2ui.codeweaver.pl/bootstrap/date-range-picker)
* `ready` [Date time range picker](http://a2ui.codeweaver.pl/bootstrap/date-time-range-picker)
* `ready` [Data table](http://a2ui.codeweaver.pl/bootstrap/data-table)
* `ready` [Modal](http://a2ui.codeweaver.pl/bootstrap/modal)
* `ready` [Pagination](http://a2ui.codeweaver.pl/bootstrap/pagination)
* `ready` [Popover](http://a2ui.codeweaver.pl/bootstrap/popover)
* `ready` [Rating](http://a2ui.codeweaver.pl/bootstrap/rating)
* `ready` [Tabs](http://a2ui.codeweaver.pl/bootstrap/tabs)
* `ready` [Typeahead](http://a2ui.codeweaver.pl/bootstrap/typeahead)
* Feedback panel
* Image viewer, image gallery


# Usage
To use bootstrap components you need to have bootstrap.js and jQuery.
There are no more external dependencies.

Install with: `npm install a2ui --save`

and use with SystemJS:

```
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            ...
            'a2ui': 'npm:a2ui'
        },
        packages: {
            ...
            a2ui: {
                defaultExtension: 'js'
            }
        }
    });
```

and example reference in code:

```
import {Alert} from "a2ui/bootstrap/alert/alert.component";

@NgModule({
    imports: [...],
    declarations: [Alert]
})
export class AppModule {}

```

# Components under consideration

* Color picker
* Charts
* Tree view
* Tree table
* Drag and drop
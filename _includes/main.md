# Speed up your Angular 2 applications development using:

# Utils:
* `ready` [Clipboard copy and cut](/utils/copy-and-cut)
* `ready` [On initialize expression](/utils/on-init)
* `ready` [Upload component](/utils/upload)
* `ready` [File drag events](/utils/file-drag-events)
* `ready` [Changes watcher](/utils/watcher)
* Table helpers
* Validation helpers
* Utility pipes collection
* Http cache

# Bootstrap:
* `ready` [Accordion](/bootstrap/accordion)
* `ready` [Alert](/bootstrap/alert)
* `ready` [Date picker](/bootstrap/date-picker)
* `ready` [Date time picker](/bootstrap/date-time-picker)
* `ready` [Date range picker](/bootstrap/date-range-picker)
* `ready` [Date time range picker](/bootstrap/date-time-range-picker)
* `ready` [Data table](/bootstrap/data-table)
* `ready` [Modal](/bootstrap/modal)
* `ready` [Pagination](/bootstrap/pagination)
* `ready` [Popover](/bootstrap/popover)
* `ready` [Rating](/bootstrap/rating)
* `ready` [Tabs](/bootstrap/tabs)
* `ready` [Typeahead](/bootstrap/typeahead)
* Feedback panel
* Image viewer, image gallery


# Usage
To use bootstrap components you need to have bootstrap.js and jQuery.
There are no more external dependencies.

Install with: `npm install a2ui --save`

and use with SystemJS:

{% highlight ts %}
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
{% endhighlight %}

and example reference in code:

{% highlight ts %}
import {Alert} from "a2ui/bootstrap/alert/alert.component";

@NgModule({
    imports: [...],
    declarations: [Alert]
})
export class AppModule {}

{% endhighlight %}

# Components under consideration

* Color picker
* Charts
* Tree view
* Tree table
* Drag and drop

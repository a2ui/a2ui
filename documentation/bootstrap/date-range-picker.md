---
layout: page
title: Bootstrap date range picker
permalink: /bootstrap/date-range-picker
---


### Overview
Allows date range selection. 
Directive can be attached to input element.
Returns date range as string in format 'yyyy-MM-dd - yyyy-MM-dd' (2016-08-31 - 2016-09-12). 

{% highlight html %}
{% raw %}
<!-- date-picker.example.component.html -->
<input date-range-picker 
    [(ngModel)]="dateRange"
    class="form-control"
    type="text"
    name="myDateRange"
    [minDate]="minDate"
    [maxDate]="maxDate" />
    
{% endraw %}
{% endhighlight %}

{% highlight ts %}
{% raw %}
<!-- date-picker.example.component.ts -->
export class DatePickerExampleComponent {
    dateRange: string = "2016-08-31 - 2016-09-12";
    minDate: Date = new Date(new Date().getTime() - 7 * 86400000);
    maxDate: Date = new Date(new Date().getTime() + 7 * 86400000);
}
{% endraw %}
{% endhighlight %}

{% highlight ts %}
options: (type) - description
{% endhighlight %}

* minDate: (Date) - earliest possible date, 
* maxDate: (Date) - latest possible date
---
layout: page
title: Bootstrap date time range picker
permalink: /bootstrap/date-time-range-picker
---

### Overview
Allows date time range selection. 
Directive can be attached to input element.
Returns date time range as string in format 'yyyy-MM-dd HH:mm - yyyy-MM-dd HH:mm' (2016-08-31 12:22 - 2016-08-31 16:22). 

{% highlight html %}
{% raw %}
<!-- date-picker.example.component.html -->
<input date-picker 
    [(ngModel)]="dateWithTimeRange"
    class="form-control"
    type="text"
    name="myDate"
    [minDate]="minDate"
    [maxDate]="maxDate" />
    
{% endraw %}
{% endhighlight %}

{% highlight ts %}
{% raw %}
<!-- date-picker.example.component.ts -->
export class DatePickerExampleComponent {
    dateWithTimeRange: string = "2016-08-31 12:22 - 2016-08-31 16:22";
    minDate: Date = new Date(new Date().getTime() - 7 * 86400000);
    maxDate: Date = new Date(new Date().getTime() + 7 * 86400000);
}
{% endraw %}
{% endhighlight %}
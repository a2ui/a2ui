---
layout: page
title: Bootstrap date picker
permalink: /bootstrap/date-picker
---

### Overview
Allows date selection. 
Directive can be attached to input element.
Returns date as string in format 'yyyy-MM-dd' (2016-08-30). 

{% highlight html %}
{% raw %}
<input date-picker 
    [(ngModel)]="date"
    type="text"
    [minDate]="minDate"
    [maxDate]="maxDate" />
    
{% endraw %}
{% endhighlight %}

{% highlight ts %}
{% raw %}
export class DatePickerExampleComponent {
    date: string = "2016-08-30"; 
    minDate: Date = new Date(new Date().getTime() - 7 * 86400000);
    maxDate: Date = new Date(new Date().getTime() + 7 * 86400000);
}
{% endraw %}
{% endhighlight %}

option name: (type) - description

* minDate: (Date) - earliest possible selectable date, 
* maxDate: (Date) - latest possible selectable date.
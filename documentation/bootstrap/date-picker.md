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
<!-- date-picker.example.component.html -->
<input date-picker 
    [(ngModel)]="date"
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
    date: string = "2016-08-30"; 
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
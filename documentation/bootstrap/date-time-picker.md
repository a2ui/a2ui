---
layout: page
title: Bootstrap date time picker
permalink: /bootstrap/date-time-picker
---

### Overview
Allows date time selection. 
Directive can be attached to input element.
Returns date time as string in format 'yyyy-MM-dd HH:mm' (2016-08-31 12:22). 

{% highlight html %}
{% raw %}
<!-- date-picker.example.component.html -->
<input date-picker 
    [(ngModel)]="dateWithTime"
    class="form-control"
    type="text"
    name="myDateTime"
    [minDate]="minDate"
    [maxDate]="maxDate" />
    
{% endraw %}
{% endhighlight %}

{% highlight ts %}
{% raw %}
<!-- date-picker.example.component.ts -->
export class DatePickerExampleComponent {
    dateWithTime: string = "2016-08-30 12:22";
    minDate: Date = new Date(new Date().getTime() - 7 * 86400000);
    maxDate: Date = new Date(new Date().getTime() + 7 * 86400000);
}
{% endraw %}
{% endhighlight %}
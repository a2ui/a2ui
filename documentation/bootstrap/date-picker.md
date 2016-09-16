---
layout: page
title: Bootstrap date picker
permalink: /bootstrap/date-picker
---

### Overview
Allows date selection

{% highlight html %}
{% raw %}
<!-- app.component.html -->
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

@ng.Component({
    selector   : "a2ui-app"
})
class AppComponent {
    componentInsidePopoverComponent: any = ComponentInsidePopoverComponent;
}

{% endhighlight %}
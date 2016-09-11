---
layout: page
title: Popover
root: false
permalink: /bootstrap/popover
---

### Overview
Shows popover with custom component.

{% highlight html %}
{% raw %}
<!-- app.component.html -->
<div (click)="p.toggle()" #p="popover"
    [a2Popover]="{ type: componentInsidePopoverComponent,
      provides: {provide: 42, useValue: 'answer'}, bs: {placement: 'top'} }">
    Show popover with component inside.
    Click to toggle.
</div>

<!-- or -->

<div (mouseout)="p.destroy()" (mouseenter)="p.show()"
     #p="popover"
     [a2Popover]="{ type: componentInsidePopoverComponent,
       provides: {provide: 42, useValue: 'answer'}, bs: {placement: 'top'} }">
    Show popover with component inside.
    (More like a tooltip, on hover.)
</div>

<a (click)="p.toggle()">Toggle Popover</a>
<a (click)="p.show()">Show Popover</a>
<a (click)="p.destroy()">Hide Popover</a>

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

{% highlight html %}
{% raw %}

<!-- component-inside-popover.component.html -->
<div> My Content Inside Popover </div>
<div> val: {{val}} </div>

{% endraw %}
{% endhighlight %}

{% highlight ts %}

@ng.Component({
    selector: "component-inside-popover.component",
    templateUrl: "..."
})
export class ComponentInsidePopoverComponent {
    constructor (@Inject(42) public val: any) {}
}

{% endhighlight %}

`a2Popover` accepts configuration object with:

{% highlight ts %}
options: {type?: ConcreteType<any>, provides?: Array<any>, bs?: any}
{% endhighlight %}

* type - Component type
* [provides](https://angular.io/docs/ts/latest/guide/dependency-injection.html#!#injector-providers) - Custom dependencies for component
* bs ([Bootstrap Settings](http://getbootstrap.com/javascript/#popovers-options))

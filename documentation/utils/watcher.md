---
layout: page
title: Watcher
root: false
permalink: /utils/watcher
---

## Changes watcher

### Overview
Execute code upon value change

### Example

{% highlight ts %}

import {WatchDirective} from "./watch/watch.directive";

bootstrap(AppComponent, [
    {provide: ng.PLATFORM_DIRECTIVES, useValue: WatchDirective, multi: true}
]);

{% endhighlight %}

{% highlight html %}
{% raw %}

<h1>Watcher</h1>
<input [(ngModel)]="watchData" value="Write here" [a2Watch]="watchData"
    (a2Change)="changeEvent = $event"> <br>
changeEvent: {{changeEvent | json}}

{% endraw %}
{% endhighlight %}
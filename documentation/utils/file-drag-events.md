---
layout: page
title: File drag events
permalink: /utils/file-drag-events
---

### Overview
Helpers created mainly to style site based on state of file drag.

With directive `a2GlobalFileIn`:

You can easily catch moment when mouse drag with files enters/leaves browser window.

 - selector: "[a2GlobalFileIn]"
 - outputs: "a2GlobalFileIn"

 `a2GlobalFileIn` event is boolean, true if mouse enters window, false if file drag is over.

With directive `a2FileIn`

You can easily catch moment when mouse drag with files enters/leaves your element.

 - selector: "[a2FileIn]"
 - outputs: "a2FileIn"

 `a2FileIn` event is boolean, true if mouse enters element, false if file drag is over or leaves element.

### Example
{% highlight html %}
{% raw %}
<div (a2GlobalFileIn)="globalFileIn = $event"
     (a2FileIn)="fileIn = $event">

    <div> Drag File Here!
        <span *ngIf="!globalFileIn && !fileIn">
        ( File is not dragged over window )
        </span>
        <span *ngIf="globalFileIn && !fileIn">
        ( File is dragged in window )
        </span>
        <span *ngIf="fileIn">
        ( File is dragged over element )
        </span>
    </div>
</div>
{% endraw %}
{% endhighlight %}

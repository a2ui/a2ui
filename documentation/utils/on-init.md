---
layout: page
title: On Initialization
permalink: /utils/on-init
---

### Overview
Execute code upon element initialization

### Example

{% highlight html %}
{% raw %}
<span (a2OnInit)="onInit = 'set by onInit'">{{onInit}}</span>
{% endraw %}
{% endhighlight %}
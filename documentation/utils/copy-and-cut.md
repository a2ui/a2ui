---
layout: page
title: Clipboard copy and cut
permalink: /utils/copy-and-cut
---

### Overview
Copy or cut text or element text to clipboard.
Easy to plug into any event in template code.
Made with JavaScript only, no flash.

{% highlight ts %}

function copy (source: HTMLElement | string): ClipboardResult {}

function cut (source: HTMLElement | string): ClipboardResult {}

interface ClipboardResult {
    clearSelection?: () => void;
    error?: any;
    success?: boolean;
    text?: string;
}

{% endhighlight %}

#### ClipboardResult
Represents result of copy/cut action.

`clearSelection` Copy action selects copied text. Calling this function will remove selection.

`error` Additional info about reason of copy/cut failure.
For example due to lack of browser support of copy/cut.

`success` If true then copy/cut action finished with success.

`text` Text that was copied / cut into clipboard.

### Example
{% highlight ts %}
import * as cb from "./clipboard/clipbard";

@ng.Component({...})
class AppComponent {
    copy: (source: HTMLElement | string) => cb.ClipboardResult = cb.copy;
    cut: (source: HTMLElement | string) => cb.ClipboardResult = cb.cut;
}

{% endhighlight %}

{% highlight html %}
{% raw %}

<input value="Copy me!" #copyRef>
<button (click)="copyResult = copy(copyRef)">Copy</button>
<button *ngIf="copyResult && copyResult.success"
        (click)="copyResult.clearSelection()">Clear selecton</button> <br>
<span>copyResult: {{copyResult | json}}</span> <br>

<input value="Cut me!" #cutRef>
<button (click)="cutResult = cut(cutRef)">Cut</button> <br>
<span>cutResult: {{cutResult | json}}</span> <br>

<button (click)="copyTextResult = copy('Some text')">Copy some text</button> <br>
<span>copyTextResult: {{copyTextResult | json}}</span> <br>
{% endraw %}
{% endhighlight %}
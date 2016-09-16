---
layout: page
title: Upload
permalink: /utils/upload
---

### Overview
Upload files immediately from input or on file drop.

Directive:

 - selector: "[a2Upload]"
 - inputs: options
 - outputs: onUpload
 - hosts: drop, change

`options` input:
{% highlight ts %}
interface UploadOptions {
    url?: string;
    headers?: Headers; // Additional headers to pass with request
    method?: string | RequestMethod; // POST, GET, PUT, ...
    search?: string | URLSearchParams; // Additional params to pass with request
    maxFiles?: number; // By default -1, -1 is unlimited
    exclude?: (f: File, index: number) => boolean; // File filter
    nameGenerator?: (f: File, index: number) => string; // FormData name generator
}
{% endhighlight %}

`onUpload` event:
{% highlight ts %}
interface UploadEvent {
    item: File; // File to be uploaded
    name: string; // Name of the file
    response: Response; // undefined on beginning,
                        // later when upload Response will arrive
                        // it will be assigned to this field
    onFinish: Subject<Response>; // Way to listen to upload Response
}
{% endhighlight %}
In case where user will drop or select multiple files then this event will be emitted for every uploaded files.
Every file is uploaded independently.

### Example
{% highlight html %}
{% raw %}

<div
    [a2Upload]="{url: 'https://posttestserver.com/post.php'}"
    (a2OnUpload)="uploads.push($event)">
</div>

{% endraw %}
{% endhighlight %}
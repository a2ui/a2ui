---
layout: page
title: Rating
root: false
permalink: /bootstrap/rating
---

### Overview

# Inputs

<table>
    <tr>
        <th>Input</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>rate</td>
        <td>number</td>
        <td>0</td>
        <td>Initial value of displayed rating.</td>
    </tr>
    <tr>
        <td>max</td>
        <td>number</td>
        <td>5</td>
        <td>Max rating value - number of stars</td>
    </tr>
    <tr>
        <td>displayMode</td>
        <td>boolean</td>
        <td>false</td>
        <td>Switch to display mode. It also enables displaying 
        fractional values.</td>
    </tr>
</table>

# Outputs

<table>
    <tr>
        <th>Output</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>rateChange</td>
        <td>EventEmitter of number</td>
        <td>Emits rating value when it changes.</td>
    </tr>
    <tr>
        <td>hoover</td>
        <td>EventEmitter of number</td>
        <td>Emits rating value hoovered by user.</td>
    </tr>
</table>

## Example

HTML:
{% highlight html %}

    <button (click)="toggle()">{{ratingDisabled ? 'Enable' : 'Disable'}} selection mode</button>
    <br/><br/>
    Your rating: <input [(ngModel)]="rating" name="input" type="number" *ngIf="ratingDisabled">
    <span *ngIf="!ratingDisabled">{{rating}}</span>
    <br/><br/>

    <div style="font-size: 20px">
        <a2-rating [displayMode]="ratingDisabled" [rate]="rating" [max]="5" (rateChange)="ratingChange($event)"
                   (hoover)="ratingHoover($event)"></a2-rating>
        <br/>
    </div>
    <span *ngIf="!ratingDisabled">Hoovered value {{hooverRating}}</span>


{% endhighlight %}

TypeScript:

{% highlight ts %}

@Component({
    selector: "a2uie-rating",
    templateUrl: "src/examples/bootstrap/rating/rating.example.component.html"
})
export class RatingExampleComponent {

    rating: number = 2.4;
    hooverRating: number;
    ratingDisabled: boolean = true;

    ratingChange(newRating: number): void {
        this.rating = newRating;
    }

    ratingHoover(rating: number): void {
        this.hooverRating = rating;
    }

    toggle(): void {
        this.ratingDisabled = !this.ratingDisabled
    }
}
{% endhighlight %}

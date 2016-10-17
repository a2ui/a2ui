import {Component} from "@angular/core";

@Component({
    selector: "a2uie-rating",
    templateUrl: "rating.example.component.html"
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
        this.ratingDisabled = !this.ratingDisabled;
    }
}

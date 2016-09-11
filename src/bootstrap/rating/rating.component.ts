import {Component, EventEmitter, Output, Input, OnInit} from "@angular/core";

@Component({
    selector: "a2-rating",
    templateUrl: "src/bootstrap/rating/rating.component.html"})
export class Rating implements OnInit {
    range: number[] = [];
    lastSelectedRate: number;

    @Input()
    rate: number;
    @Input()
    max: number = 5;
    @Input()
    disabled: boolean = false;
    @Output()
    rateChange: EventEmitter<number> = new EventEmitter<number>();
    @Output()
    hoover: EventEmitter<number> = new EventEmitter<number>();

    ngOnInit(): any {
        this.range = Array(this.max);
        this.lastSelectedRate = this.rate;
    }

    private save(value: number): void {
        if (this.disabled) return;
        this.rate = this.lastSelectedRate = value;
        this.rateChange.emit(value);
    }

    private update(value: number): void {
        if (this.disabled) return;
        this.rate = value;
        this.hoover.emit(value);
    }

    private reset(): void {
        if (this.disabled) return;
        this.rate = this.lastSelectedRate;
        this.hoover.emit(this.rate);
    }

    private getWidth(index: number): string {
        if (!this.disabled || index + 1 < this.rate) {
            return 100 + "%";
        } else {
            let part: number = this.rate - index;
            return (part >= 1 || part <= 0 ? 1 : part) * 100 + "%";
        }
    }

    private getClass(index: number): string {
        return this.isSelected(index) ? "glyphicon-star rating-selection" : this.disabled ? "" : "glyphicon-star-empty";
    }

    private isSelected(index: number): boolean {
        return index < this.rate;
    }
}

import {Component, ViewChildren, QueryList, Output, EventEmitter, AfterViewInit} from "@angular/core";
import {Hint} from "./hint.directive";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/filter";


enum KEYS  {
    UP = 38,
    DOWN = 40,
    ENTER = 9,
    TAB = 13,
    ESC = 27
}

@Component({
    selector: "a2ui-suggestions",
    templateUrl: "src/bootstrap/typeahead/hints.component.html"
})
export class SuggestionsComponent implements AfterViewInit {

    @ViewChildren(Hint) hints: QueryList<Hint>;

    @Output() selectHint: EventEmitter<any> = new EventEmitter();

    items: Array<any>;

    private pointedHint: Hint;

    ngAfterViewInit(): void {
        // viewChild is set after the view has been initialized
        let onHints: (hints: QueryList<Hint>) => void = (hints: QueryList<Hint>) => {
            this.linkHintsArray(hints.toArray());
            this.point(hints.first);
        };

        this.hints.changes.subscribe(onHints);
        onHints(this.hints);
    }

    onKeyDown(key: number): void {
        if (KEYS.UP === key) {
            this.point(this.pointedHint.prev);
        } else if (KEYS.DOWN === key) {
            this.point(this.pointedHint.next);
        } else if (KEYS.ESC === key) {
            this.hide();
        } else if ([KEYS.ENTER, KEYS.TAB].indexOf(key) >= 0) {
            this.select(this.pointedHint);
        }
    }

    point(hint: Hint): void {
        let pointedInPast: Hint = this.pointedHint;
        this.pointedHint = hint;
        if (pointedInPast) {
            pointedInPast.blur();
        }
        if (hint) {
            hint.focus();
        }
    }

    hide(): void {
        this.items = undefined;
        this.pointedHint = undefined;
    }

    select(hint: Hint): void {
        this.point(hint);
        this.selectHint.emit(hint.data);
        this.hide();
    }

    hasItems(): boolean {
        return this.items && this.items.length > 0;
    }

    private linkHintsArray(hintsArray: Hint[]): void {
        hintsArray.forEach(linkWithNeighbours);

        function linkWithNeighbours(hint: Hint, index: number): void {
            if (index > 0) hint.prev = hintsArray[index - 1]; else hint.prev = hintsArray[hintsArray.length - 1];
            if (index < hintsArray.length - 1) hint.next = hintsArray[index + 1]; else hint.next = hintsArray[0];
        }
    }
}

import {ContentChild, Directive, forwardRef, TemplateRef, Input} from "@angular/core";

let nextId: number = 0;

@Directive({
    selector: "a2-tab"
})
export class Tab {

    @Input()
    name: string = "tab-" + nextId++;
    @Input()
    public disabled: boolean = false;

    @ContentChild(forwardRef(() => TabHeader))
    private header: TabHeader;
    @ContentChild(forwardRef(() => TabBody))
    private body: TabBody;
}

@Directive({
    selector: "template[tabHeader]"
})
export class TabHeader {
    constructor(public templateRef: TemplateRef<any>) {
    }
}

@Directive({
    selector: "template[tabBody]"
})
export class TabBody {
    constructor(public templateRef: TemplateRef<any>) {
    }
}

/*
 PART OF SOURCE TAKEN FRoM https://github.com/text-mask/text-mask/

 This is free and unencumbered software released into the public domain.

 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a compiled
 binary, for any purpose, commercial or non-commercial, and by any
 means.

 In jurisdictions that recognize copyright laws, the author or authors
 of this software dedicate any and all copyright interest in the
 software to the public domain. We make this dedication for the benefit
 of the public at large and to the detriment of our heirs and
 successors. We intend this dedication to be an overt act of
 relinquishment in perpetuity of all present and future rights to this
 software under copyright law.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

 For more information, please refer to <http://unlicense.org>
 */
import {Directive, ElementRef, Input, OnInit} from "@angular/core";
import {FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {MaskCreator} from "./mask-creator";

@Directive({
    host: {
        "(input)": "onInput()"
    },
    selector: "[a2Mask]",
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: MaskedDirective, multi: true}
    ]
})
export class MaskedDirective implements OnInit, ControlValueAccessor {

    @Input("a2Mask") mask: any;

    formControl: FormControl = new FormControl();

    private textMaskInputElement: any;
    private inputElement: HTMLInputElement;

    private _onTouched = () => {
    };
    private _onChange = (_: any) => {
    };

    constructor (private element: ElementRef) {
    }

    ngOnInit (): void {
        if (this.element.nativeElement.tagName === "INPUT") {
            // `textMask` directive is used directly on an input element
            this.inputElement = this.element.nativeElement;
        } else {
            // `textMask` directive is used on an abstracted input element, `ion-input`, `md-input`, etc
            this.inputElement = this.element.nativeElement.getElementsByTagName("INPUT")[0];
        }

        this.textMaskInputElement = MaskCreator.createTextMaskInputElement(this.inputElement, this.mask);
    }

    writeValue (value: any): void {
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(value);
        }
    }

    registerOnChange (fn: (value: any) => any): void {
        this._onChange = fn
    }

    registerOnTouched (fn: () => any): void {
        this._onTouched = fn
    }

    onInput (): void {
        this.textMaskInputElement.update(this.inputElement.value);
        this._onChange(this.inputElement.value);
    }
}


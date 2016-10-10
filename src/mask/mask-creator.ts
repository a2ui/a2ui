export class MaskCreator {

    static maskingCharacters: string[] = [
        "1",
        "A",
        "?",
        "U",
        "L",
        "*"
    ];

    static maskingCharactersEnums: any = {
        numeric: "1",
        alphabetic: "A",
        alphanumeric: "?",
        uppercase: "U",
        lowercase: "L",
        any: "*"
    };

    static createTextMaskInputElement (inputElement: HTMLInputElement, mask: any): any {
        let state: any = {previousConformedInput: ""};
        let placeholderChar: string = "_";
        let componentPlaceholder: string = this.convertMaskToPlaceholder(mask, placeholderChar);

        inputElement.placeholder = (inputElement.placeholder !== "") ? inputElement.placeholder : componentPlaceholder;

        return {
            state,

            update(valueToConform: string = inputElement.value): void {
                if (valueToConform === state.previousConformedInput) {
                    inputElement.value = valueToConform;
                    return;
                }

                let {selectionStart: currentCaretPosition}: any = inputElement;
                let {previousConformedInput}: any = state;
                let safeValueToConform: string = MaskCreator.getSafeInputValue(valueToConform);
                let conformToMaskConfig: any = {previousConformedInput, placeholderChar};
                let conformToMaskResults: any = MaskCreator.conformToMask(safeValueToConform, mask, conformToMaskConfig);

                let {output: outputOfConformToMask}: any = conformToMaskResults;
                let adjustedCaretPosition: number = MaskCreator.adjustCaretPosition(
                    previousConformedInput,
                    conformToMaskResults,
                    currentCaretPosition
                );
                let valueShouldBeEmpty: boolean = (
                    outputOfConformToMask === componentPlaceholder && adjustedCaretPosition === 0
                );
                let conformedInput: string = (valueShouldBeEmpty) ? "" : outputOfConformToMask;

                inputElement.value = conformedInput;
                state.previousConformedInput = conformedInput;
                MaskCreator.safeSetSelection(inputElement, adjustedCaretPosition);
            }
        };
    }

    static getEscapedMaskedValue (value: string, mask: string): string {
        let state: any = {previousConformedInput: ""};
        let safeValueToConform: string = MaskCreator.getSafeInputValue(value);
        let {previousConformedInput}: any = state;
        let placeholderChar: string = "_";
        let conformToMaskConfig: any = {previousConformedInput, placeholderChar};
        let conformToMaskResults: any = MaskCreator.conformToMask(safeValueToConform, mask, conformToMaskConfig);

        return conformToMaskResults.output;
    }

    private static getSafeInputValue (inputValue: any): string {
        if (MaskCreator.isString(inputValue)) {
            return inputValue;
        } else if (MaskCreator.isNumber(inputValue)) {
            return String(inputValue);
        } else if (inputValue === undefined || inputValue === null) {
            return "";
        } else {
            throw new Error(
                "The \"value\" provided to Text Mask needs to be a string or a number. The value " +
                `received was:\n\n ${JSON.stringify(inputValue)}`
            );
        }
    }

    private static safeSetSelection (element: HTMLInputElement, selectionPosition: number): void {
        if (document.activeElement === element) {
            element.setSelectionRange(selectionPosition, selectionPosition);
        }
    }

    private static convertMaskToPlaceholder (mask: string = "", placeholderChar: string): string {
        if (mask.indexOf(placeholderChar) !== -1) {
            console.log("Text Mask received placeholder character: ", placeholderChar); // eslint-disable-line
            console.log("Text Mask received mask: ", mask); // eslint-disable-line

            throw new Error(
                "Placeholder character must not be used as part of the mask. Please specify a character " +
                "that is not present in your mask as your placeholder character."
            );
        }

        let escaping: boolean = false;
        let placeholder: string = "";

        for (let i: number = 0; i < mask.length; i++) {
            let character: string = mask[i];

            if (character === "\\" && escaping !== true) {
                escaping = true;
                placeholder += "";
                continue;
            }

            if (escaping === true) {
                escaping = false;
                placeholder += character;
                continue;
            }

            placeholder += (MaskCreator.maskingCharacters.indexOf(character) !== -1) ?
                placeholderChar :
                character;
        }

        return placeholder;
    }

    private static adjustCaretPosition (previousConformedInput: string = "",
                                        conformToMaskResults: any = {},
                                        currentCaretPosition: number = 0): number {
        if (currentCaretPosition === 0) {
            return 0;
        }

        let {output: conformedInput = "", meta = {}}: any = conformToMaskResults;
        let {input: rawInput = "", placeholderChar, placeholder}: any = meta;

        // Tells us the index of the first change. For (438) 394-4938 to (38) 394-4938, that would be 1
        let indexOfFirstChange: number = MaskCreator.getIndexOfFirstChange(previousConformedInput, rawInput);

        // When user modifies string from (444) 444-44__ to (444) 444-444_ while caret is at position
        // 2, `indexOfChange` would be 12. This is what I call ambiguous change
        let isAmbiguousChange: boolean = (indexOfFirstChange - currentCaretPosition) > 1;

        // If the change is ambiguous. Our best bet is to keep the caret where it is.
        if (isAmbiguousChange) {
            return currentCaretPosition;
        }

        // True when user tries to add a character. Like, (___) ___-____ to (4___) ___-____
        let isAddition: boolean = !(rawInput.length < previousConformedInput.length);

        // This is true when user has entered more than one character per iteration. This happens
        // when user pastes or makes a selection and edits
        let isMultiCharEdit: boolean = Math.abs(previousConformedInput.length - rawInput.length) > 1;

        // This is the first character the user entered that needs to be conformed to mask
        let isFirstChar: boolean = rawInput.length === 1;

        // A partial multi-character edit happens when the user makes a partial selection in their
        // input and edit that selection. That is going from `(123) 432-4348` to `() 432-4348` by
        // selecting the first 3 digits and pressing backspace.
        //
        // Such cases can also happen when the user presses the backspace while holding down the ALT
        // key.
        let isPartialMultiCharEdit: boolean = isMultiCharEdit && !isAddition && !isFirstChar;

        // For a mask like (111), if the `previousConformedInput` is (1__) and user attempts to enter
        // `f` so the `rawInput` becomes (1f__), the new `conformedInput` would be (1__), which is the
        // same as the original `previousConformedInput`. We handle this case differently for caret
        // positioning.
        let possiblyHasRejectedChar: boolean = isAddition && (
                previousConformedInput === conformedInput ||
                conformedInput === placeholder
            );

        // There"s an edge case when the user enters the first character of the mask and it"s a mask
        // delimiter. For example, mask (111) 111-1111, and user enters `(`. In this case, the
        // `previousConformedInput` would be empty string and conformedInput would be `(___) ___-____`
        // This case is treated differently in caret positioning.
        let onlyEnteredAMaskDelimiter: boolean = previousConformedInput === "" && conformedInput === placeholder;

        // If operation is paste, that is input goes from (___) ___-___ to (650) 333-3__ in one change,
        // we want to find the next suitable caret position in the `conformedInput` string. Otherwise,
        // we always want to use the `placeholder` for our target for caret placement.
        let baseTargetForCaretPlacement: any = (isMultiCharEdit || isFirstChar) ?
            conformedInput :
            placeholder;

        // This is true when user attempts to insert a character in a non-placeholder position.
        // For example, for mask (111) 111-1111, if the user tries to enter a character 5 at position 0
        // which is before the first `(`, this flag would be `true`.
        let isCharInsertedInNonPlaceholderIndex: boolean = placeholder[indexOfFirstChange] !== placeholderChar;

        // We can reasonably expect that we will adjust the caret position starting from the
        // original/current caret position
        let startingSearchIndex: number = currentCaretPosition;

        // This algorithm doesn"t support all cases of multi-character edits, so we just return
        // the current caret position.
        //
        // This works fine for most cases.
        if (isPartialMultiCharEdit) {
            return currentCaretPosition;

            // If the operation is a multi-char edit or this is the first character the user is entering,
            // we start from the beginning of the `conformedInput` string and look for the next
            // `placeholderChar` to place the caret at it
        } else if (isMultiCharEdit || isFirstChar) {
            startingSearchIndex = 0;

            // Else if operation has rejected character, we wanna go back a step and start searching from
            // there because the caret will have advanced after entering the rejected character
        } else if (possiblyHasRejectedChar) {
            startingSearchIndex--;

            // Else if none of the conditions above is true, and the operation is addition, let"s start the
            // search from the first `placeholderChar` position.
        } else if (isAddition) {
            for (let i: number = currentCaretPosition; i < placeholder.length; i++) {
                let needsAdjustmentByOne: boolean = (
                    isCharInsertedInNonPlaceholderIndex && !onlyEnteredAMaskDelimiter
                );

                if (placeholder[i] === placeholderChar) {
                    // So, we found the next `placeholderChar`. But we need to adjust by `1` if the user
                    // made their change in a none-placeholder character position and if that change is not
                    // just a mask delimiter.
                    startingSearchIndex = i + (needsAdjustmentByOne ? 1 : 0);
                    break;
                }
            }
        }

        // At this point, we have determined a reasonable index from which we can begin searching for
        // the correct caret position and we"ve put it in `startingSearchIndex`. And we"ve determined
        // the base in which to look for the caret position, whether `placeholder` or `conformedInput`.
        //
        // Now, if `isAddition`, we seek forward. Otherwise we seek back.
        if (isAddition || isFirstChar) {
            for (let i: number = startingSearchIndex; i <= baseTargetForCaretPlacement.length; i++) {
                if (
                    // If we"re adding, we can position the caret at the next placeholder character.
                baseTargetForCaretPlacement[i] === placeholderChar ||

                // This is the end of the target. We cannot move any further. Let"s put the caret there.
                i === baseTargetForCaretPlacement.length
                ) {
                    // Limiting `i` to the length of the `conformedInput` is a brute force fix for caret
                    // positioning in `!guide` mode. There are a few edge cases which are
                    // solved by this. To see what happens without it, uncomment the line below and run
                    // the test suite

                    // return i
                    return (i > conformedInput.length) ? conformedInput.length : i;
                }
            }
        } else {
            for (let i: number = startingSearchIndex; i >= 0; i--) {
                // If we"re deleting, we stop the caret right before the placeholder character.
                // For example, for mask `(111) 11`, current conformed input `(456) 86`. If user
                // modifies input to `(456 86`. That is, they deleted the `)`, we place the caret
                // right after the first `6`
                if (
                    baseTargetForCaretPlacement[i - 1] === placeholderChar ||

                    // This is the beginning of the target. We cannot move any further.
                    // Let"s put the caret there.
                    i === 0
                ) {
                    return i;
                }
            }
        }
    }

    private static conformToMask (userInput: string = "", mask: string = "", config: any = {}): any {
        // These configurations tell us how to conform the mask
        let {
            guide = true,
            previousConformedInput = "",
            placeholderChar = "_",
            validator: isCustomValid = (val: any) => {
                return true;
            }
        }: any = config;

        // We will be iterating over each character in the placeholder and sort of fill it up
        // with user input
        let placeholder: string = this.convertMaskToPlaceholder(mask, placeholderChar);

        // The configs below indicate that the user wants the algorithm to work in *no guide* mode
        let suppressGuide: boolean = guide === false && previousConformedInput !== undefined;

        // Tells us the index of the first change. For (438) 394-4938 to (38) 394-4938, that would be 1
        let indexOfFirstChange: number = MaskCreator.getIndexOfFirstChange(previousConformedInput, userInput);

        // This tells us the number of edited characters and the direction in which they were edited (+/-)
        let numberOfEditedChars: number = userInput.length - previousConformedInput.length;

        let userInputArr: string[] = MaskCreator.tokenize(userInput);

        // In *no guide* mode, we need to know if the user is trying to add a character or not
        let isAddition: boolean = suppressGuide && !(userInput.length < previousConformedInput.length);

        // Unescaping a mask turns a mask like `+\1 (111) 111-1111` into `+  (111) 111-1111`. That is,
        // it substituted an escaped character with empty white space. We do that because further down
        // in the algorithm when we insert user input characters into the placeholder, we don"t want the
        // code to think that we can insert a numeric character in the `1` spot (which when unescaped
        // stands for *any numeric character*).
        let unescapedMask: string = MaskCreator.unescapeMask(mask);

        // The loop below removes masking characters from user input. For example, for mask
        // `00 (111)`, the placeholder would be `00 (___)`. If user input is `00 (234)`, the loop below
        // would remove all characters but `234` from the `userInputArr`. The rest of the algorithm
        // then would lay `234` on top of the available placeholder positions in the mask.
        let numberOfSpliceOperations: number = 0;
        for (let i: number = 0; i < placeholder.length && userInputArr.length > 0; i++) {
            let shouldJumpAheadInUserInput: boolean = i >= indexOfFirstChange && previousConformedInput !== "";
            let userInputPointer: number = (
                (shouldJumpAheadInUserInput ? i + numberOfEditedChars : i) - numberOfSpliceOperations
            );

            if (placeholder[i] === userInputArr[userInputPointer] &&
                userInputArr[userInputPointer] !== placeholderChar) {
                userInputArr.splice(userInputPointer, 1);

                numberOfSpliceOperations++;
            }
        }

        // This is the variable that we will be filling with characters as we figure them out
        // in the algorithm below
        let conformedString: string = "";

        // Ok, so first we loop through the placeholder looking for placeholder characters to fill up.
        placeholderLoop: for (let i: number = 0; i < placeholder.length; i++) {
            let charInPlaceholder: string = placeholder[i];

            // We see one. Let"s find out what we can put in it.
            if (charInPlaceholder === placeholderChar) {
                // But before that, do we actually have any user characters that need a place?
                if (userInputArr.length > 0) {
                    // We will keep chipping away at user input until either we run out of characters
                    // or we find at least one character that we can map.
                    while (userInputArr.length > 0) {
                        // Let"s retrieve the first user character in the queue of characters we have left
                        let userInputChar: string = userInputArr.shift();

                        // If the character we got from the user input is a placeholder character (which happens
                        // regularly because user input could be something like (540) 90_-____, which includes
                        // a bunch of `_` which are placeholder characters) and we are not in *no guide* mode,
                        // then we map this placeholder character to the current spot in the placeholder
                        if (userInputChar === placeholderChar && suppressGuide !== true) {
                            conformedString += placeholderChar;

                            // And we go to find the next placeholder character that needs filling
                            continue placeholderLoop;

                            // Else if, the character we got from the user input is not a placeholder, let"s see
                            // if the current position in the mask can accept it.
                        } else if (this.isAcceptableCharacter(userInputChar, unescapedMask[i])) {
                            // if it is accepted. We map it--performing any necessary transforming along the way,
                            // like upper casing or lower casing.
                            conformedString += this.potentiallyTransformCharacter(userInputChar, unescapedMask[i]);

                            // Since we"ve mapped this placeholder position. We move on to the next one.
                            continue placeholderLoop;
                        }
                    }
                }

                // We reach this point when we"ve mapped all the user input characters to placeholder
                // positions in the mask. In *guide* mode, we append the left over characters in the
                // placeholder to the `conformedString`, but in *no guide* mode, we don"t wanna do that.
                //
                // That is, for mask `(111)` and user input `2`, we want to return `(2`, not `(2__)`.
                if (suppressGuide === false) {
                    conformedString += placeholder.substr(i, placeholder.length);
                }

                // And we break
                break;

                // Else, the characterInPlaceholder is not a placeholderCharacter. That is, we cannot fill it
                // with user input. So we just map it to the final output
            } else {
                conformedString += charInPlaceholder;
            }
        }

        // The following logic is needed to deal with the case of deletion in *no guide* mode.
        //
        // Consider the silly mask `(111) /// 1`. What if user tries to delete the last placeholder
        // position? Something like `(589) /// `. We want to conform that to `(589`. Not `(589) /// `.
        // That"s why the logic below finds the last filled placeholder character, and removes everything
        // from that point on.
        if (suppressGuide && isAddition === false) {
            let indexOfLastFilledPlaceholderChar: number = null;

            // Find the last filled placeholder position and substring from there
            for (let i: number = 0; i < conformedString.length; i++) {
                if (placeholder[i] === placeholderChar) {
                    indexOfLastFilledPlaceholderChar = i;
                }
            }

            if (indexOfLastFilledPlaceholderChar !== null) {
                // We substring from the beginning until the position after the last filled placeholder char.
                conformedString = conformedString.substr(0, indexOfLastFilledPlaceholderChar + 1);
            } else {
                // If we couldn"t find `indexOfLastFilledPlaceholderCharacter` that means the user deleted
                // the first character in the mask. So we return an empty string.
                conformedString = "";
            }
        }

        return {
            output: isCustomValid(conformedString) ? conformedString : previousConformedInput,
            meta: {
                input: userInput,
                mask: mask,
                guide,
                placeholderChar,
                placeholder
            }
        };
    }

    private static getIndexOfFirstChange (stringOne: string, stringTwo: string): number {
        let longestLength: number = (stringOne.length > stringTwo.length) ? stringOne.length : stringTwo.length;

        for (let i: number = 0; i < longestLength; i++) {
            if (stringOne[i] !== stringTwo[i]) {
                return i;
            }
        }

        return null;
    }

    private static isString (value: any): boolean {
        return typeof value === "string" || value instanceof String;
    }

    private static isNumber (value: any): boolean {
        return value && value.length === undefined && !isNaN(value);
    }

    private static tokenize (value: string = ""): string[] {
        return value.split("");
    }

    private static unescapeMask (mask: string = ""): string {
        return mask.replace(/\\./g, " ");
    }

    private static isAcceptableCharacter (character: string = "", maskingCharacter: string): boolean {
        switch (maskingCharacter) {
            case this.maskingCharactersEnums.numeric:
                return MaskCreator.isNumeric(character);

            case this.maskingCharactersEnums.uppercase:
            case this.maskingCharactersEnums.lowercase:
            case this.maskingCharactersEnums.alphabetic:
                return MaskCreator.isAlphabetic(character);

            case this.maskingCharactersEnums.alphanumeric:
                return MaskCreator.isNumeric(character) || MaskCreator.isAlphabetic(character);

            case this.maskingCharactersEnums.any:
                return true;

            default:
                return false;
        }
    }

    private static isNumeric (character: any): boolean {
        return !isNaN(character) && character !== " ";
    }

    private static isAlphabetic (character: any): boolean {
        return /^[a-zA-Z]+$/.test(character);
    }

    private static potentiallyTransformCharacter (character: string = "", maskingCharacter: string): string {
        switch (maskingCharacter) {
            case this.maskingCharactersEnums.uppercase:
                return character.toUpperCase();

            case this.maskingCharactersEnums.lowercase:
                return character.toLowerCase();

            default:
                return character;
        }
    }
}

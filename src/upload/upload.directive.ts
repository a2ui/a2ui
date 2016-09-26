import {Directive, EventEmitter, AfterContentInit, OnDestroy, NgZone, Type, ElementRef} from "@angular/core";
import {Http, Headers, Response, RequestMethod, URLSearchParams} from "@angular/http";
import {Subject} from "rxjs/Subject";

@Directive({
    selector: "[a2Upload]",
    outputs: ["onUpload: a2OnUpload"],
    inputs: ["options: a2Upload"],
    host: {
        "(drop)": "onDrop($event)",
        "(change)": "onChange($event)",
    }
})
export class UploadDirective {
    private onUpload: EventEmitter<UploadEvent> = new EventEmitter<UploadEvent>();
    private options: UploadOptions = {};

    constructor(private http: Http) {
    }

    onChange(event: Event): void {
        let et: HTMLInputElement = (<HTMLInputElement>event.target);
        this.upload(et.files);
    }

    onDrop(event: DragEvent): void {
        let dataTransfer: DataTransfer = event.dataTransfer;

        if (!dataTransfer || !dataTransfer.files || dataTransfer.files.length <= 0) {
            return;
        }

        this.upload(dataTransfer.files);
    }

    private upload(files: FileList): void {
        let options: UploadOptions = this.options,
            maxFiles: number = options.maxFiles || -1,
            nameGenerator: (f: File, index: number) => string = options.nameGenerator || (() => "file" ),
            exclude: (f: File, index: number) => boolean = options.exclude || (() => false),
            headers: Headers = options.headers || UploadDirective.defaultHeaders(),
            method: string | RequestMethod = options.method || "POST",
            search: string | URLSearchParams = options.search,
            url: string = options.url || "/upload";

        if (maxFiles !== -1 && files.length > maxFiles) {
            let filesCopy: any = [];
            filesCopy.length = maxFiles;

            filesCopy.item = (index: number): File => {
                return index > maxFiles ? undefined : files.item(index);
            };

            for (let i: number = 0; i < maxFiles; i++) {
                filesCopy[i] = files[i];
            }
            files = <FileList> filesCopy;
        }

        for (let i: number = 0; i < files.length; i++) {

            if (exclude(files.item(i), i)) {
                continue;
            }

            let formData: FormData = new FormData();
            formData.append(nameGenerator(files.item(i), i), files.item(i));

            let upload: UploadEvent = {
                item: files.item(i),
                name: files.item(i).name,
                response: undefined,
                onFinish: new Subject<Response>()
            };

            this.onUpload.emit(upload);

            this.http.request(url, {
                method: method,
                headers: headers,
                search: search,
                body: formData,
            }).subscribe((response: Response) => {
                upload.response = response;
                upload.onFinish.next(response);
                upload.onFinish.complete();
            }, (error: any) => {
                upload.onFinish.error(error);
            });
        }
    }

    private static defaultHeaders(): Headers {
        let headers: Headers = new Headers();
        headers.append("Content-Type", "multipart/form-data");
        return new Headers();
    }
}

let uploadComponents: LocalUploadDirective[] = [];
let globalDragStartListeners: GlobalUploadDirective[] = [];

@Directive({
    selector: "[a2FileIn]",
    outputs: ["fileIn: a2FileIn"],
})
export class LocalUploadDirective implements AfterContentInit, OnDestroy {
    public mouseIsOver: boolean = false;
    public fileIn: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public ref: ElementRef, public zone: NgZone) {
        ref.nativeElement.addEventListener("dragover", function (event: any): boolean {
            // Element can handle drop event
            event.preventDefault();
            return false;
        });
    }

    ngAfterContentInit(): void {
        uploadComponents.push(this);
    }

    ngOnDestroy(): void {
        uploadComponents.splice(uploadComponents.indexOf(this), 1);
    };
}

@Directive({
    selector: "[a2GlobalFileIn]",
    outputs: ["globalFileIn: a2GlobalFileIn"],
})
export class GlobalUploadDirective implements AfterContentInit, OnDestroy {
    public mouseIsOver: boolean = false;
    public globalFileIn: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public zone: NgZone) {
    }

    ngAfterContentInit(): void {
        globalDragStartListeners.push(this);
    }

    ngOnDestroy(): void {
        globalDragStartListeners.splice(globalDragStartListeners.indexOf(this), 1);
    };
}

let dragTimer: number;

document.addEventListener("dragover", (event: DragEvent) => {

    window.clearTimeout(dragTimer);

    if (isDragSourceExternalFile(event)) {
        // Start drag file
        let directive: LocalUploadDirective = getLocalUploadDirective(event);
        if (directive !== undefined) {

            if (directive.mouseIsOver === false) {
                directive.mouseIsOver = true;

                directive.zone.run(() => {
                    directive.fileIn.emit(true);
                });
            }
        }


        for (let i: number = 0; i < globalDragStartListeners.length; i++) {
            let listener: GlobalUploadDirective = globalDragStartListeners[i];
            if (listener.mouseIsOver === false) {
                listener.mouseIsOver = true;

                listener.zone.run(() => {
                    listener.globalFileIn.emit(true);
                });
            }
        }
    }
});

document.addEventListener("dragleave", (event: DragEvent) => {
    window.clearTimeout(dragTimer);

    if (isDragSourceExternalFile(event)) {
        // File drag leave
        let directive: LocalUploadDirective = uploadComponents.find((d) => {
            return event.target === d.ref.nativeElement;
        });

        if (directive !== undefined &&
            (event.target === directive.ref.nativeElement
                || !inSide(<HTMLElement>event.target, directive.ref.nativeElement)
            )) {

            directive.mouseIsOver = false;

            directive.zone.run(() => {
                directive.fileIn.emit(false);
            });

            // Element can handle upload
            return false;
        }
    }

    dragTimer = window.setTimeout(() => {
        for (let i: number = 0; i < globalDragStartListeners.length; i++) {
            let listener: GlobalUploadDirective = globalDragStartListeners[i];
            listener.mouseIsOver = false;

            listener.zone.run(() => {
                listener.globalFileIn.emit(false);
            });
        }
    }, 80);
});

document.addEventListener("drop", (event: DragEvent) => {
    window.clearTimeout(dragTimer);

    if (isDragSourceExternalFile(event)) {

        for (let i: number = 0; i < globalDragStartListeners.length; i++) {
            let listener: GlobalUploadDirective = globalDragStartListeners[i];
            listener.mouseIsOver = false;

            listener.zone.run(() => {
                listener.globalFileIn.emit(false);
            });
        }

        for (let i: number = 0; i < uploadComponents.length; i++) {
            let listener: LocalUploadDirective = uploadComponents[i];
            listener.mouseIsOver = false;

            listener.zone.run(() => {
                listener.fileIn.emit(false);
            });
        }
    }

});

function isDragSourceExternalFile(event: DragEvent): boolean {
    let dt: DataTransfer = event.dataTransfer;
    // tslint:disable-next-line
    return dt.types != null && ((<any>dt.types).indexOf ? (<any>dt.types).indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'));
}

function getLocalUploadDirective(event: DragEvent): LocalUploadDirective {
    return uploadComponents.find((d) => {
        return inSide(<HTMLElement>event.target, d.ref.nativeElement);
    });
}

function inSide(element: Node, container: HTMLElement): boolean {
    if (!(element === container)) {
        if (element !== document.body && element !== null) {
            return inSide(element.parentNode, container);
        } else {
            return false;
        }
    }
    return true;
}

export const UPLOAD_DIRECTIVES: Type<any>[] = [UploadDirective, LocalUploadDirective, GlobalUploadDirective];

export interface UploadOptions {
    url?: string;
    headers?: Headers; // Additional headers to pass with request
    method?: string | RequestMethod; // POST, GET, PUT, ...
    search?: string | URLSearchParams; // Additional params to pass with request
    maxFiles?: number; // By default -1, -1 is unlimited
    exclude?: (f: File, index: number) => boolean; // File filter
    nameGenerator?: (f: File, index: number) => string; // FormData name generator
}

export interface UploadEvent {
    item: File; // File to be uploaded
    name: string; // Name of the file
    response: Response; // undefined on beginning, later when upload Response will arrive it will be assigned to this field
    onFinish: Subject<Response>; // Way to listen to upload Response
}

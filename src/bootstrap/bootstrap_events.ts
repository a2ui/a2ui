import {EVENT_MANAGER_PLUGINS, EventManager} from "@angular/platform-browser";
import {Injectable, forwardRef, NgZone} from "@angular/core";

// tslint:disable-next-line
const $: any = window["$"];

export const BOOTSTRAP_EVENTS_PLUGIN: any = {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: forwardRef(() => BootstrapEventsPlugin),
    multi: true
};

@Injectable()
export class BootstrapEventsPlugin {
    private manager: EventManager;

    supports (eventName: string): boolean {
        return eventName.indexOf(".bs.") > -1;
    };

    addEventListener (element: HTMLElement, eventName: string, handler: Function): Function {
        let zone: NgZone = this.manager.getZone();
        let outsideHandler: any = (event: any) => {
            zone.runGuarded(() => handler(event));
        };
        return this.manager.getZone().runOutsideAngular(
            () => {
                $(element).on(eventName, outsideHandler);
                return () => {
                    $(element).off(eventName, outsideHandler);
                };
            });
    }
}

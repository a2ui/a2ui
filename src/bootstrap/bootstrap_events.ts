import * as ng from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {EventManagerPlugin} from "@angular/platform-browser/src/dom/events/event_manager";

// tslint:disable-next-line
const $: any = window["$"];

export const BOOTSTRAP_EVENTS_PLUGIN: any = {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: ng.forwardRef(() => BootstrapEventsPlugin),
    multi: true
};

@ng.Injectable()
export class BootstrapEventsPlugin extends EventManagerPlugin {
    supports (eventName: string): boolean {
        return eventName.indexOf(".bs.") > -1;
    };

    addEventListener (element: HTMLElement, eventName: string, handler: Function): Function {
        let zone: ng.NgZone = this.manager.getZone();
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

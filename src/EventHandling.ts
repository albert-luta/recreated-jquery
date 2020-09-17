type ElementAccepted = Window | Document | Element;

export type EventHandler = (element: ElementAccepted, index: number, event: Event) => any;

export interface OnMultipleEvents {
	[event: string]: EventHandler;
}

class EventHandling {
	private static atachHandler(
		el: ElementAccepted,
		index: number,
		event: string,
		handler: EventHandler
	) {
		el.addEventListener(event, (e: Event) => {
			handler.call(el, el, index, e);
		});
	}

	static on(elements: ElementAccepted[], event: string, handler: EventHandler): void;
	static on(elements: ElementAccepted[], event: OnMultipleEvents): void;
	static on(elements: ElementAccepted[], event: any, handler?: any): void {
		if (typeof event === 'string') {
			elements.forEach((el, i) => {
				EventHandling.atachHandler(el, i, event, handler);
			});
		} else {
			const eventsEntries = Object.entries(event as OnMultipleEvents);

			elements.forEach((el, i) => {
				eventsEntries.forEach(([eventName, fn]) => {
					EventHandling.atachHandler(el, i, eventName, fn);
				});
			});
		}
	}
}

export default EventHandling;

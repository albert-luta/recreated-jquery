export interface OnMultipleEvents {
	[event: string]: () => any;
}

type ElementsAccepted = (Window | Document | Element)[];

class Events {
	static on(elements: ElementsAccepted, event: string, handler: () => any): void;
	static on(elements: ElementsAccepted, event: OnMultipleEvents): void;
	static on(elements: ElementsAccepted, event: any, handler?: any): void {
		if (typeof event === 'string') {
			elements.forEach((el) => {
				el.addEventListener(event, handler.bind(el));
			});
		} else {
			const eventsEntries = Object.entries(event as OnMultipleEvents);

			elements.forEach((el) => {
				eventsEntries.forEach(([e, fn]) => {
					el.addEventListener(e, fn.bind(el as Element));
				});
			});
		}
	}
}

export default Events;

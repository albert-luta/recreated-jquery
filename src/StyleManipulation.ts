import { JQueryElementAccepted } from './JQuery';

enum Manipulation {
	Add = 'add',
	Remove = 'remove',
	Toggle = 'toggle',
}

class StyleManipulation {
	private static manipulateClass(
		elements: JQueryElementAccepted[],
		classes: string[],
		manipulation: Manipulation
	) {
		elements.forEach((el) => {
			classes.forEach((cssClass) => {
				if (el !== window && el !== document) {
					(el as Element).classList[manipulation](cssClass);
				}
			});
		});
	}

	static addClass(elements: JQueryElementAccepted[], classes: string[]) {
		StyleManipulation.manipulateClass(elements, classes, Manipulation.Add);
	}

	static removeClass(elements: JQueryElementAccepted[], classes: string[]) {
		StyleManipulation.manipulateClass(elements, classes, Manipulation.Remove);
	}

	static toggleClass(elements: JQueryElementAccepted[], classes: string[]) {
		StyleManipulation.manipulateClass(elements, classes, Manipulation.Toggle);
	}

	static css(elements: JQueryElementAccepted[], property: string): string | undefined;
	static css(elements: JQueryElementAccepted[], property: { [property: string]: string }): null;
	static css(elements: JQueryElementAccepted[], property: string, value?: string): null;
	static css(elements: JQueryElementAccepted[], property: any, value?: string): any {
		if (!elements.length) return;

		if (typeof property === 'string') {
			if (typeof value === 'string') {
				elements.forEach((el) => {
					(el as HTMLElement).style[property as any] = value;
				});

				return null;
			} else {
				if (elements[0] === window || elements[0] === document) return;
				return getComputedStyle(elements[0] as Element)[property as any];
			}
		} else {
			const cssEntries = Object.entries(property as { [property: string]: string });

			elements.forEach((el) => {
				cssEntries.forEach(([prop, val]) => {
					(el as HTMLElement).style[prop as any] = val;
				});
			});

			return null;
		}
	}
}

export default StyleManipulation;

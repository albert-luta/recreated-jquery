enum Manipulation {
	Add = 'add',
	Remove = 'remove',
	Toggle = 'toggle',
}

class StyleManipulation {
	private static manipulateClass(
		elements: Element[],
		classes: string[],
		manipulation: Manipulation
	) {
		elements.forEach((el) => {
			classes.forEach((cssClass) => {
				el.classList[manipulation](cssClass);
			});
		});
	}

	static addClass(elements: Element[], classes: string[]) {
		StyleManipulation.manipulateClass(elements, classes, Manipulation.Add);
	}

	static removeClass(elements: Element[], classes: string[]) {
		StyleManipulation.manipulateClass(elements, classes, Manipulation.Remove);
	}

	static toggleClass(elements: Element[], classes: string[]) {
		StyleManipulation.manipulateClass(elements, classes, Manipulation.Toggle);
	}

	static css(elements: Element[], property: string): string | undefined;
	static css(elements: Element[], property: { [property: string]: string }): null;
	static css(elements: Element[], property: string, value?: string): null;
	static css(elements: Element[], property: any, value?: string): any {
		if (!elements.length) return;

		if (typeof property === 'string') {
			if (typeof value === 'string') {
				elements.forEach((el) => {
					(el as HTMLElement).style[property as any] = value;
				});

				return null;
			} else {
				return getComputedStyle(elements[0])[property as any];
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

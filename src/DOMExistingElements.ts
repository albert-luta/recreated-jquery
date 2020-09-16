enum Dimension {
	Width = 'width',
	Height = 'height',
}

class DOMExistingElements {
	static text(elements: Element[]): string;
	static text(elements: Element[], input: string): null;
	static text(elements: Element[], input: (index: number, originalText: string) => string): null;
	static text(elements: Element[], input?: any): any {
		if (input == null) {
			return elements.reduce((acc, curr) => acc + (curr.textContent ?? ''), '');
		}

		if (typeof input === 'string') {
			elements.forEach((el) => (el.textContent = input));
		} else if (typeof input === 'function') {
			elements.forEach((el, index) => {
				el.textContent = input(index, el.textContent);
			});
		}

		return null;
	}

	static html(elements: Element[]): string;
	static html(elements: Element[], input: string): null;
	static html(elements: Element[], input: (index: number, originalText: string) => string): null;
	static html(elements: Element[], input?: any): any {
		if (input == null) {
			return elements.reduce((acc, curr) => acc + curr.innerHTML, '');
		}

		if (typeof input === 'string') {
			elements.forEach((el) => (el.innerHTML = input));
		} else if (typeof input === 'function') {
			elements.forEach((el, index) => {
				el.innerHTML = input(index, el.innerHTML);
			});
		}

		return null;
	}

	static val(elements: Element[]): string;
	static val(elements: Element[], input: string): null;
	static val(elements: Element[], input: (index: number, originalText: string) => string): null;
	static val(elements: Element[], input?: any): any {
		if (input == null) {
			return elements.reduce((acc, curr) => {
				if (!(curr instanceof HTMLInputElement)) return acc;

				return acc + curr.value;
			}, '');
		}

		if (typeof input === 'string') {
			elements.forEach((el) => {
				if (el instanceof HTMLInputElement) el.value = input;
			});
		} else if (typeof input === 'function') {
			elements.forEach((el, index) => {
				if (el instanceof HTMLInputElement) el.value = input(index, el.value);
			});
		}

		return null;
	}

	static attr(elements: Element[], attribute: string): string | undefined;
	static attr(elements: Element[], attribute: { [attribute: string]: string }): null;
	static attr(elements: Element[], attribute: string, modifier: string): null;
	static attr(
		elements: Element[],
		attribute: string,
		modifier: (index: number, originalValue: string) => string
	): null;
	static attr(elements: Element[], attribute: any, modifier?: any): any {
		if (modifier == null) {
			if (typeof attribute === 'string') {
				if (!elements.length) return;

				return elements[0].getAttribute(attribute) ?? undefined;
			} else {
				const attributeEntries = Object.entries(attribute);

				elements.forEach((el) => {
					attributeEntries.forEach(([a, value]) => el.setAttribute(a, value as string));
				});

				return null;
			}
		} else {
			if (typeof modifier === 'string') {
				elements.forEach((el) => {
					el.setAttribute(attribute, modifier);
				});
			} else {
				elements.forEach((el, index) => {
					el.setAttribute(attribute, modifier(index, el.getAttribute(attribute)));
				});
			}

			return null;
		}
	}

	private static manipulateDimension(
		elements: Element[],
		property: Dimension,
		value?: string | number
	): string | number | undefined | null {
		if (value === undefined) {
			if (!elements.length) return;

			const val = getComputedStyle(elements[0] as HTMLElement).getPropertyValue(property);

			return val.includes('px') ? parseFloat(val) : val;
		} else {
			const val = typeof value === 'number' ? `${value}px` : value;

			elements.forEach((el) => ((el as HTMLElement).style[property] = val));

			return null;
		}
	}

	static width(elements: Element[], value?: string | number) {
		return DOMExistingElements.manipulateDimension(elements, Dimension.Width, value);
	}

	static height(elements: Element[], value?: string | number) {
		return DOMExistingElements.manipulateDimension(elements, Dimension.Height, value);
	}

	private static getInnerDimension(elements: Element[], typeOfDimension: Dimension) {
		if (!elements.length) return;

		return (elements[0] as HTMLElement)[
			typeOfDimension === Dimension.Width ? 'clientWidth' : 'clientHeight'
		];
	}

	static innerWidth(elements: Element[]) {
		return DOMExistingElements.getInnerDimension(elements, Dimension.Width);
	}

	static innerHeight(elements: Element[]) {
		return DOMExistingElements.getInnerDimension(elements, Dimension.Height);
	}

	private static getOuterDimension(
		elements: Element[],
		typeOfDimension: Dimension,
		includeMargins?: boolean
	) {
		if (!elements.length) return;

		let dimension = elements[0].getBoundingClientRect()[typeOfDimension];
		if (includeMargins) {
			const computedStyle = getComputedStyle(elements[0]);
			let margin1: string | number;
			let margin2: string | number;

			if (typeOfDimension === Dimension.Width) {
				({ marginLeft: margin1, marginRight: margin2 } = computedStyle);
			} else {
				({ marginTop: margin1, marginBottom: margin2 } = computedStyle);
			}

			margin1 = parseFloat(margin1);
			margin2 = parseFloat(margin2);

			dimension += margin1 + margin2 ?? 0;
		}

		return dimension;
	}

	static outerWidth(elements: Element[], includeMargins?: boolean) {
		return DOMExistingElements.getOuterDimension(elements, Dimension.Width, includeMargins);
	}

	static outerHeight(elements: Element[], includeMargins?: boolean) {
		return DOMExistingElements.getOuterDimension(elements, Dimension.Height, includeMargins);
	}
}

export default DOMExistingElements;

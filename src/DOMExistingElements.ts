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

	static innerWidth(elements: Element[]) {
		if (!elements.length) return;

		return (elements[0] as HTMLElement).clientWidth;
	}

	static innerHeight(elements: Element[]) {
		if (!elements.length) return;

		return (elements[0] as HTMLElement).clientHeight;
	}

	static outerWidth(elements: Element[], includeMargins?: boolean) {
		if (!elements.length) return;

		let width = elements[0].getBoundingClientRect().width;
		if (includeMargins) {
			let {
				marginLeft,
				marginRight,
			}: { marginLeft: string | number; marginRight: string | number } = getComputedStyle(
				elements[0]
			);
			marginLeft = parseFloat(marginLeft);
			marginRight = parseFloat(marginRight);

			width += marginLeft + marginRight ?? 0;
		}

		return width;
	}

	static outerHeight(elements: Element[], includeMargins?: boolean) {
		if (!elements.length) return;

		let height = elements[0].getBoundingClientRect().height;
		if (includeMargins) {
			let {
				marginTop,
				marginBottom,
			}: { marginTop: string | number; marginBottom: string | number } = getComputedStyle(
				elements[0]
			);
			marginTop = parseFloat(marginTop);
			marginBottom = parseFloat(marginBottom);

			height += marginTop + marginBottom ?? 0;
		}

		return height;
	}
}

export default DOMExistingElements;

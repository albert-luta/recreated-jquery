import { JQueryElementAccepted } from './JQuery';

enum Dimension {
	Width = 'width',
	Height = 'height',
}

class DOMExistingElements {
	static text(elements: JQueryElementAccepted[]): string;
	static text(elements: JQueryElementAccepted[], input: string): null;
	static text(
		elements: JQueryElementAccepted[],
		input: (index: number, originalText: string) => string
	): null;
	static text(elements: JQueryElementAccepted[], input?: any): any {
		if (input == null) {
			return elements.reduce((acc, curr) => acc + ((curr as any).textContent ?? ''), '');
		}

		if (typeof input === 'string') {
			elements.forEach((el) => {
				if (el !== window) (el as Element | Document).textContent = input;
			});
		} else if (typeof input === 'function') {
			elements.forEach((el, index) => {
				if (el !== window) {
					(el as Element | Document).textContent = input(
						index,
						(el as Element | Document).textContent
					);
				}
			});
		}

		return null;
	}

	static html(elements: JQueryElementAccepted[]): string;
	static html(elements: JQueryElementAccepted[], input: string): null;
	static html(
		elements: JQueryElementAccepted[],
		input: (index: number, originalText: string) => string
	): null;
	static html(elements: JQueryElementAccepted[], input?: any): any {
		if (input == null) {
			return elements.reduce((acc, curr) => acc + (curr as any).innerHTML ?? '', '');
		}

		if (typeof input === 'string') {
			elements.forEach((el) => {
				if (el !== window && el !== document) {
					(el as Element).innerHTML = input;
				}
			});
		} else if (typeof input === 'function') {
			elements.forEach((el, index) => {
				if (el !== window && el !== document) {
					(el as Element).innerHTML = input(index, (el as Element).innerHTML);
				}
			});
		}

		return null;
	}

	static val(elements: JQueryElementAccepted[]): string;
	static val(elements: JQueryElementAccepted[], input: string): null;
	static val(
		elements: JQueryElementAccepted[],
		input: (index: number, originalText: string) => string
	): null;
	static val(elements: JQueryElementAccepted[], input?: any): any {
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

	static attr(elements: JQueryElementAccepted[], attribute: string): string | undefined;
	static attr(
		elements: JQueryElementAccepted[],
		attribute: { [attribute: string]: string }
	): null;
	static attr(elements: JQueryElementAccepted[], attribute: string, modifier: string): null;
	static attr(
		elements: JQueryElementAccepted[],
		attribute: string,
		modifier: (index: number, originalValue: string) => string
	): null;
	static attr(elements: JQueryElementAccepted[], attribute: any, modifier?: any): any {
		if (modifier == null) {
			if (typeof attribute === 'string') {
				if (!elements.length) return;

				return (elements[0] as any).getAttribute?.(attribute) ?? undefined;
			} else {
				const attributeEntries = Object.entries(attribute);

				elements.forEach((el) => {
					attributeEntries.forEach(([a, value]) =>
						(el as any).setAttribute?.(a, value as string)
					);
				});

				return null;
			}
		} else {
			if (typeof modifier === 'string') {
				elements.forEach((el) => {
					(el as any).setAttribute?.(attribute, modifier);
				});
			} else {
				elements.forEach((el, index) => {
					(el as any).setAttribute?.(
						attribute,
						modifier(index, (el as any).getAttribute?.(attribute) ?? '')
					);
				});
			}

			return null;
		}
	}

	private static manipulateDimension(
		elements: JQueryElementAccepted[],
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

	static width(elements: JQueryElementAccepted[], value?: string | number) {
		return DOMExistingElements.manipulateDimension(elements, Dimension.Width, value);
	}

	static height(elements: JQueryElementAccepted[], value?: string | number) {
		return DOMExistingElements.manipulateDimension(elements, Dimension.Height, value);
	}

	private static getInnerDimension(
		elements: JQueryElementAccepted[],
		typeOfDimension: Dimension
	) {
		if (!elements.length) return;

		return (elements[0] as HTMLElement)[
			typeOfDimension === Dimension.Width ? 'clientWidth' : 'clientHeight'
		];
	}

	static innerWidth(elements: JQueryElementAccepted[]) {
		return DOMExistingElements.getInnerDimension(elements, Dimension.Width);
	}

	static innerHeight(elements: JQueryElementAccepted[]) {
		return DOMExistingElements.getInnerDimension(elements, Dimension.Height);
	}

	private static getOuterDimension(
		elements: JQueryElementAccepted[],
		typeOfDimension: Dimension,
		includeMargins?: boolean
	) {
		if (!elements.length || elements[0] === window || elements[0] === document) return;

		let dimension = (elements[0] as Element).getBoundingClientRect()[typeOfDimension];
		if (includeMargins) {
			const computedStyle = getComputedStyle(elements[0] as Element);
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

	static outerWidth(elements: JQueryElementAccepted[], includeMargins?: boolean) {
		return DOMExistingElements.getOuterDimension(elements, Dimension.Width, includeMargins);
	}

	static outerHeight(elements: JQueryElementAccepted[], includeMargins?: boolean) {
		return DOMExistingElements.getOuterDimension(elements, Dimension.Height, includeMargins);
	}
}

export default DOMExistingElements;

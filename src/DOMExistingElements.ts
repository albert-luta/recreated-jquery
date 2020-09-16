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
}

export default DOMExistingElements;

import TypeGuards from './TypeGuards';

export type PropName =
	| string
	| Element
	| NodeListOf<Element>
	| Element[]
	| null
	| undefined
	| (() => any);

class JQuery {
	private elements: Element[] = [];

	constructor(prop: PropName) {
		if (TypeGuards.isSelector(prop)) {
			this.elements = [...document.querySelectorAll(prop)];
		} else if (TypeGuards.isElement(prop)) {
			this.elements = [prop];
		} else if (TypeGuards.isNodeList(prop)) {
			this.elements = [...prop];
		} else if (TypeGuards.isArrayOfElements(prop)) {
			this.elements = prop;
		} else if (TypeGuards.isReadyFunction(prop)) {
			document.addEventListener('DOMContentLoaded', prop);
		}
	}

	text(): string;
	text(input: string): this;
	text(input: (index: number, originalText: string) => string): this;
	text(input?: any): any {
		if (input == null) {
			return this.elements.reduce((acc, curr) => acc + (curr.textContent ?? ''), '');
		}

		if (typeof input === 'string') {
			this.elements.forEach((el) => (el.textContent = input));
		} else if (typeof input === 'function') {
			this.elements.forEach((el, index) => {
				el.textContent = input(index, el.textContent);
			});
		}

		return this;
	}
}

export default JQuery;

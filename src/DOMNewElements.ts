import JQuery from './JQuery';
import TypeGuards from './TypeGuards';

export type ElementsToInsert = (
	| string
	| Element
	| null
	| NodeListOf<Element>
	| (Element | null)[]
	| JQuery
)[];

enum InsertPosition {
	Before = 'beforebegin',
	Prepend = 'afterbegin',
	Append = 'beforeend',
	After = 'afterend',
}

class DOMNewElements {
	static create(element: string) {
		return new JQuery(document.createElement(element));
	}

	static clone(elements: Element[]): Element[] {
		return elements.map((el) => el.cloneNode(true)) as Element[];
	}

	private static insert(
		position: InsertPosition,
		elements: Element[],
		elementsToInsert: ElementsToInsert
	) {
		elementsToInsert.forEach((elementToInsert) => {
			elements.forEach((el) => {
				if (typeof elementToInsert === 'string') {
					el.insertAdjacentHTML(position, elementToInsert);
				} else if (TypeGuards.isElement(elementToInsert)) {
					elementToInsert.remove();
					el.insertAdjacentElement(position, elementToInsert);
				} else if (
					TypeGuards.isNodeList(elementToInsert) ||
					TypeGuards.isArrayOfElements(elementToInsert)
				) {
					elementToInsert.forEach((element: Element | null) => {
						if (!element) return;

						element.remove();
						el.insertAdjacentElement(position, element);
					});
				} else if (elementToInsert instanceof JQuery) {
					elementToInsert.each((jQueryEl) => {
						jQueryEl.remove();
						el.insertAdjacentElement(position, jQueryEl);
					});
				}
			});
		});
	}

	static append(elements: Element[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.Append, elements, elementsToAppend);
	}

	static prepend(elements: Element[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.Prepend, elements, elementsToAppend);
	}

	static before(elements: Element[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.Before, elements, elementsToAppend);
	}

	static after(elements: Element[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.After, elements, elementsToAppend);
	}

	static remove(elements: Element[], filters: string[]) {
		if (!filters.length) {
			elements.forEach((el) => el.remove());
		} else {
			elements.forEach((el) => {
				filters.forEach((filter) => {
					if (el.matches(filter)) el.remove();
				});
			});
		}
	}

	private static emptyElement(element: Element) {
		while (element.lastChild) element.lastChild.remove();
	}

	static empty(elements: Element[], filters: string[]) {
		if (!filters.length) {
			elements.forEach((el) => DOMNewElements.emptyElement(el));
		} else {
			elements.forEach((el) => {
				filters.forEach((filter) => {
					if (el.matches(filter)) DOMNewElements.emptyElement(el);
				});
			});
		}
	}
}

export default DOMNewElements;

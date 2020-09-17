import JQuery, { JQueryElementAccepted } from './JQuery';
import TypeGuards from './TypeGuards';

export type ElementsToInsert = (string | Element | null | NodeList | (Element | null)[] | JQuery)[];

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

	static clone(elements: JQueryElementAccepted[]): JQueryElementAccepted[] {
		return elements.map((el) => {
			if (el === window) return window;
			return (el as Element | Document).cloneNode(true);
		}) as JQueryElementAccepted[];
	}

	private static insert(
		position: InsertPosition,
		elements: JQueryElementAccepted[],
		elementsToInsert: ElementsToInsert
	) {
		elementsToInsert.forEach((elementToInsert) => {
			elements.forEach((el) => {
				if (el === window) return;

				const elCorrect = el === document ? document.body : el;
				if (typeof elementToInsert === 'string') {
					(elCorrect as Element).insertAdjacentHTML(position, elementToInsert);
				} else if (TypeGuards.isElement(elementToInsert)) {
					elementToInsert.remove();
					(elCorrect as Element).insertAdjacentElement(position, elementToInsert);
				} else if (
					TypeGuards.isNodeList(elementToInsert) ||
					TypeGuards.isJQueryElementAccepted(elementToInsert)
				) {
					(elementToInsert as any).forEach?.((element: any) => {
						if (element instanceof Element) {
							element.remove();
							(elCorrect as Element).insertAdjacentElement(position, element);
						}
					});
				} else if (elementToInsert instanceof JQuery) {
					elementToInsert.each((jQueryEl) => {
						jQueryEl.remove();
						(elCorrect as Element).insertAdjacentElement(position, jQueryEl);
					});
				}
			});
		});
	}

	static append(elements: JQueryElementAccepted[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.Append, elements, elementsToAppend);
	}

	static prepend(elements: JQueryElementAccepted[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.Prepend, elements, elementsToAppend);
	}

	static before(elements: JQueryElementAccepted[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.Before, elements, elementsToAppend);
	}

	static after(elements: JQueryElementAccepted[], elementsToAppend: ElementsToInsert) {
		DOMNewElements.insert(InsertPosition.After, elements, elementsToAppend);
	}

	static remove(elements: JQueryElementAccepted[], filters: string[]) {
		if (!filters.length) {
			elements.forEach((el) => (el as any).remove?.());
		} else {
			elements.forEach((el) => {
				filters.forEach((filter) => {
					if ((el as any).matches?.(filter)) (el as any).remove?.();
				});
			});
		}
	}

	private static emptyElement(element: JQueryElementAccepted) {
		while ((element as any).lastChild) (element as any).lastChild.remove?.();
	}

	static empty(elements: JQueryElementAccepted[], filters: string[]) {
		if (!filters.length) {
			elements.forEach((el) => DOMNewElements.emptyElement(el));
		} else {
			elements.forEach((el) => {
				filters.forEach((filter) => {
					if ((el as any).matches?.(filter)) DOMNewElements.emptyElement(el);
				});
			});
		}
	}
}

export default DOMNewElements;

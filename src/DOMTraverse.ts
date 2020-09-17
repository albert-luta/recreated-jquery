import { JQueryElementAccepted } from './JQuery';

enum Direction {
	Next = 'nextElementSibling',
	Prev = 'previousElementSibling',
}

class DOMTraverse {
	static parent(elements: JQueryElementAccepted[]) {
		return elements.map((el) => {
			if (el === window) return window;
			if (el === document) return document;
			return (el as Element).parentElement;
		}) as JQueryElementAccepted[];
	}

	private static getParents(elements: JQueryElementAccepted[], stopSelector?: string) {
		const parents = new Set();

		elements.forEach((el) => {
			let current: JQueryElementAccepted | null = el;
			while (
				(current as any)?.parentElement &&
				(stopSelector ? !(current as Element).parentElement?.matches?.(stopSelector) : true)
			) {
				parents.add((current as Element).parentElement);
				current = (current as Element).parentElement;
			}
		});

		return [...parents] as JQueryElementAccepted[];
	}

	static parents(elements: JQueryElementAccepted[]) {
		return DOMTraverse.getParents(elements);
	}

	static parentsUntil(elements: JQueryElementAccepted[], stopSelector: string) {
		return DOMTraverse.getParents(elements, stopSelector);
	}

	static children(elements: JQueryElementAccepted[], filter?: string) {
		if (!elements.length || elements[0] === window) return [];

		return [...(elements[0] as Element).children].filter((el) =>
			filter ? el.matches(filter) : true
		) as JQueryElementAccepted[];
	}

	static find(elements: JQueryElementAccepted[], selector: string) {
		if (!elements.length || elements[0] === window) return [];

		return [...(elements[0] as Element).querySelectorAll(selector)] as JQueryElementAccepted[];
	}

	static filter(elements: JQueryElementAccepted[], selector: string) {
		return elements.filter((el) => {
			if (el === window || el === document) return false;
			return (el as Element).matches(selector);
		});
	}

	static not(elements: JQueryElementAccepted[], selector: string) {
		return elements.filter((el) => {
			if (el === window || el === document) return false;
			return !(el as Element).matches(selector);
		});
	}

	static siblings(elements: JQueryElementAccepted[], filterSelector?: string) {
		return elements
			.map((el) =>
				[...((el as any).parentElement?.children ?? [])].filter(
					(element) =>
						element !== el && (filterSelector ? element.matches(filterSelector) : true)
				)
			)
			.flat() as JQueryElementAccepted[];
	}

	private static getAdjacentSibling(elements: JQueryElementAccepted[], direction: Direction) {
		return elements
			.map((el) => (el as any)[direction])
			.filter(Boolean) as JQueryElementAccepted[];
	}

	static next(elements: JQueryElementAccepted[]) {
		return DOMTraverse.getAdjacentSibling(elements, Direction.Next);
	}

	static prev(elements: JQueryElementAccepted[]) {
		return DOMTraverse.getAdjacentSibling(elements, Direction.Prev);
	}

	private static getAdjacentSiblings(
		elements: JQueryElementAccepted[],
		direction: Direction,
		stopSelector?: string
	) {
		const siblings = new Set();

		elements.forEach((el) => {
			let current: JQueryElementAccepted | null = el;
			while (
				(current as any)?.[direction] &&
				(stopSelector ? !(current as any)[direction]?.matches?.(stopSelector) : true)
			) {
				siblings.add((current as Element)[direction]);
				current = (current as Element)[direction];
			}
		});

		return [...siblings] as JQueryElementAccepted[];
	}

	static nextAll(elements: JQueryElementAccepted[]) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Next);
	}

	static prevAll(elements: JQueryElementAccepted[]) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Prev);
	}

	static nextUntil(elements: JQueryElementAccepted[], stopSelector: string) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Next, stopSelector);
	}

	static prevUntil(elements: JQueryElementAccepted[], stopSelector: string) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Prev, stopSelector);
	}
}

export default DOMTraverse;

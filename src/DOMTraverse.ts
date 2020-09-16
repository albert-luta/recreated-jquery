enum Direction {
	Next = 'nextElementSibling',
	Prev = 'previousElementSibling',
}

class DOMTraverse {
	static parent(elements: Element[]) {
		return elements.map((el) => el.parentElement as Element);
	}

	private static getParents(elements: Element[], stopSelector?: string) {
		const parents = new Set();

		elements.forEach((el) => {
			let current = el;
			while (
				current.parentElement &&
				(stopSelector ? !current.parentElement.matches(stopSelector) : true)
			) {
				parents.add(current.parentElement);
				current = current.parentElement;
			}
		});

		return [...parents] as Element[];
	}

	static parents(elements: Element[]) {
		return DOMTraverse.getParents(elements);
	}

	static parentsUntil(elements: Element[], stopSelector: string) {
		return DOMTraverse.getParents(elements, stopSelector);
	}

	static children(elements: Element[], filter?: string) {
		if (!elements.length) return [];

		return [...elements[0].children].filter((el) =>
			filter ? el.matches(filter) : true
		) as Element[];
	}

	static find(elements: Element[], selector: string) {
		if (!elements.length) return [];

		return [...elements[0].querySelectorAll(selector)] as Element[];
	}

	static filter(elements: Element[], selector: string) {
		return elements.filter((el) => el.matches(selector));
	}

	static not(elements: Element[], selector: string) {
		return elements.filter((el) => !el.matches(selector));
	}

	static siblings(elements: Element[], filterSelector?: string) {
		return elements
			.map((el) =>
				[...(el.parentElement?.children ?? [])].filter(
					(element) =>
						element !== el && (filterSelector ? element.matches(filterSelector) : true)
				)
			)
			.flat();
	}

	private static getAdjacentSibling(elements: Element[], direction: Direction) {
		return elements.map((el) => el[direction]).filter(Boolean) as Element[];
	}

	static next(elements: Element[]) {
		return DOMTraverse.getAdjacentSibling(elements, Direction.Next);
	}

	static prev(elements: Element[]) {
		return DOMTraverse.getAdjacentSibling(elements, Direction.Prev);
	}

	private static getAdjacentSiblings(
		elements: Element[],
		direction: Direction,
		stopSelector?: string
	) {
		const siblings = new Set();

		elements.forEach((el) => {
			let current = el;
			while (
				current[direction] &&
				(stopSelector ? !current[direction]!.matches(stopSelector) : true)
			) {
				siblings.add(current[direction]);
				current = current[direction] as Element;
			}
		});

		return [...siblings] as Element[];
	}

	static nextAll(elements: Element[]) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Next);
	}

	static prevAll(elements: Element[]) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Prev);
	}

	static nextUntil(elements: Element[], stopSelector: string) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Next, stopSelector);
	}

	static prevUntil(elements: Element[], stopSelector: string) {
		return DOMTraverse.getAdjacentSiblings(elements, Direction.Prev, stopSelector);
	}
}

export default DOMTraverse;

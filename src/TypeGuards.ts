class TypeGuards {
	static isSelector(selector: any): selector is string {
		return typeof selector === 'string';
	}

	static isElement(element: any): element is Element {
		return element instanceof Element;
	}

	static isNodeList(nodeList: any): nodeList is NodeList {
		return nodeList instanceof NodeList;
	}

	static isArrayOfElements(arrayOfElements: any): arrayOfElements is Element[] {
		return (
			arrayOfElements instanceof Array &&
			!arrayOfElements.some((el) => !(el instanceof Element))
		);
	}

	static isNullish(value: any): value is null | undefined {
		return value == null;
	}

	static isReadyFunction(fn: any): fn is () => any {
		return typeof fn === 'function';
	}
}

export default TypeGuards;

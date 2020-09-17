import { EventHandler } from './EventHandling';
import { JQueryElementAccepted } from './JQuery';

class TypeGuards {
	static isSelector(selector: any): selector is string {
		return typeof selector === 'string';
	}

	static isElement(element: any): element is Element {
		return element instanceof Element;
	}

	static isWindow(element: any): element is Window {
		return element === window;
	}

	static isDocument(element: any): element is Document {
		return element === document;
	}

	static isJQueryElementAccepted(element: any): element is JQueryElementAccepted {
		return (
			TypeGuards.isElement(element) ||
			TypeGuards.isWindow(element) ||
			TypeGuards.isDocument(element)
		);
	}

	static isNodeList(nodeList: any): nodeList is NodeList {
		return nodeList instanceof NodeList;
	}

	static isArrayOfJQueryElementAccepted(
		arrayOfJQueryElementAccepted: any
	): arrayOfJQueryElementAccepted is (JQueryElementAccepted | null)[] {
		return (
			arrayOfJQueryElementAccepted instanceof Array &&
			!arrayOfJQueryElementAccepted.some(
				(el) => !TypeGuards.isJQueryElementAccepted(el) || el !== null
			)
		);
	}

	static isNullish(value: any): value is null | undefined {
		return value == null;
	}

	static isReadyFunction(fn: any): fn is EventHandler {
		return typeof fn === 'function';
	}
}

export default TypeGuards;

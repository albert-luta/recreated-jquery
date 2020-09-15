import TypeGuards from './TypeGuards';
import EventHandling, { OnMultipleEvents } from './EventHandling';
import DOMManipulation from './DOMManipulation';

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
			window.addEventListener('DOMContentLoaded', prop);
		}
	}

	/**
	 * DOM manipulations
	 */

	text(): string;
	text(input: string): this;
	text(input: (index: number, originalText: string) => string): this;
	text(input?: any): any {
		const res = DOMManipulation.text(this.elements, input);

		if (res !== null) return res;

		return this;
	}

	html(): string;
	html(input: string): this;
	html(input: (index: number, originalText: string) => string): this;
	html(input?: any): any {
		const res = DOMManipulation.html(this.elements, input);

		if (res !== null) return res;

		return this;
	}

	val(): string;
	val(input: string): this;
	val(input: (index: number, originalText: string) => string): this;
	val(input?: any): any {
		const res = DOMManipulation.val(this.elements, input);

		if (res !== null) return res;

		return this;
	}

	attr(attribute: string): string | undefined;
	attr(attribute: { [attribute: string]: string }): this;
	attr(attribute: string, modifier: string): this;
	attr(attribute: string, modifier: (index: number, originalValue: string) => string): this;
	attr(attribute: any, modifier?: any): any {
		const res = DOMManipulation.attr(this.elements, attribute, modifier);

		if (typeof res === 'string' || res === undefined) return res;

		return this;
	}

	/**
	 * Events handling
	 */

	on(event: string, handler: () => any): this;
	on(event: OnMultipleEvents): this;
	on(event: any, handler?: any): this {
		EventHandling.on(this.elements, event, handler);

		return this;
	}

	click(handler: () => any): this {
		EventHandling.on(this.elements, 'click', handler);

		return this;
	}

	dblclick(handler: () => any): this {
		EventHandling.on(this.elements, 'dblclick', handler);

		return this;
	}

	mouseenter(handler: () => any): this {
		EventHandling.on(this.elements, 'mouseenter', handler);

		return this;
	}

	mouseleave(handler: () => any): this {
		EventHandling.on(this.elements, 'mouseleave', handler);

		return this;
	}

	mousedown(handler: () => any): this {
		EventHandling.on(this.elements, 'mousedown', handler);

		return this;
	}

	mouseup(handler: () => any): this {
		EventHandling.on(this.elements, 'mouseup', handler);

		return this;
	}

	focus(handler: () => any): this {
		EventHandling.on(this.elements, 'focus', handler);

		return this;
	}

	blur(handler: () => any): this {
		EventHandling.on(this.elements, 'blur', handler);

		return this;
	}

	hover(handleMouseEnter: () => any, handleMouseLeave: () => any): this {
		EventHandling.on(this.elements, 'mouseenter', handleMouseEnter);
		EventHandling.on(this.elements, 'mouseleave', handleMouseLeave);

		return this;
	}
}

export default JQuery;

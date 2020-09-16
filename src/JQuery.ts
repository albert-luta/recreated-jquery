import TypeGuards from './TypeGuards';
import EventHandling, { OnMultipleEvents } from './EventHandling';
import DOMExistingElements from './DOMExistingElements';
import DOMNewElements, { ElementsToInsert } from './DOMNewElements';
import DOMTraverse from './DOMTraverse';

export type PropName =
	| string
	| Element
	| NodeListOf<Element>
	| (Element | null)[]
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
			this.elements = [...prop.filter(Boolean)] as Element[];
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
		const res = DOMExistingElements.text(this.elements, input);

		if (res !== null) return res;

		return this;
	}

	html(): string;
	html(input: string): this;
	html(input: (index: number, originalText: string) => string): this;
	html(input?: any): any {
		const res = DOMExistingElements.html(this.elements, input);

		if (res !== null) return res;

		return this;
	}

	val(): string;
	val(input: string): this;
	val(input: (index: number, originalText: string) => string): this;
	val(input?: any): any {
		const res = DOMExistingElements.val(this.elements, input);

		if (res !== null) return res;

		return this;
	}

	attr(attribute: string): string | undefined;
	attr(attribute: { [attribute: string]: string }): this;
	attr(attribute: string, modifier: string): this;
	attr(attribute: string, modifier: (index: number, originalValue: string) => string): this;
	attr(attribute: any, modifier?: any): any {
		const res = DOMExistingElements.attr(this.elements, attribute, modifier);

		if (typeof res === 'string' || res === undefined) return res;

		return this;
	}

	each(handler: (element: Element, index: number) => any) {
		this.elements.forEach((el, i) => handler.call(el, el, i));
	}

	clone() {
		this.elements = DOMNewElements.clone(this.elements);

		return this;
	}

	append(...elements: ElementsToInsert) {
		DOMNewElements.append(this.elements, elements);

		return this;
	}

	prepend(...elements: ElementsToInsert) {
		DOMNewElements.prepend(this.elements, elements);

		return this;
	}

	before(...elements: ElementsToInsert) {
		DOMNewElements.before(this.elements, elements);

		return this;
	}

	after(...elements: ElementsToInsert) {
		DOMNewElements.after(this.elements, elements);

		return this;
	}

	remove(...filters: string[]) {
		DOMNewElements.remove(this.elements, filters);

		return this;
	}

	empty(...filters: string[]) {
		DOMNewElements.empty(this.elements, filters);

		return this;
	}

	/**
	 * DOM Traversing
	 */

	parent() {
		this.elements = DOMTraverse.parent(this.elements);

		return this;
	}

	parents() {
		this.elements = DOMTraverse.parents(this.elements);

		return this;
	}

	parentsUntil(stopSelector: string) {
		this.elements = DOMTraverse.parentsUntil(this.elements, stopSelector);

		return this;
	}

	children(filter?: string) {
		this.elements = DOMTraverse.children(this.elements, filter);

		return this;
	}

	find(selector: string) {
		this.elements = DOMTraverse.find(this.elements, selector);

		return this;
	}

	first() {
		if (this.elements.length) {
			this.elements = [this.elements[0]];
		}

		return this;
	}

	last() {
		if (this.elements.length) {
			this.elements = [this.elements[this.elements.length - 1]];
		}

		return this;
	}

	eq(index: number) {
		if (index >= 0 && index < this.elements.length) {
			this.elements = [this.elements[index]];
		} else this.elements = [];

		return this;
	}

	filter(selector: string) {
		this.elements = DOMTraverse.filter(this.elements, selector);

		return this;
	}

	not(selector: string) {
		this.elements = DOMTraverse.not(this.elements, selector);

		return this;
	}

	siblings(filterSelector?: string) {
		this.elements = DOMTraverse.siblings(this.elements, filterSelector);

		return this;
	}

	next() {
		this.elements = DOMTraverse.next(this.elements);

		return this;
	}

	prev() {
		this.elements = DOMTraverse.prev(this.elements);

		return this;
	}

	nextAll() {
		this.elements = DOMTraverse.nextAll(this.elements);

		return this;
	}

	prevAll() {
		this.elements = DOMTraverse.prevAll(this.elements);

		return this;
	}

	nextUntil(stopSelector: string) {
		this.elements = DOMTraverse.nextUntil(this.elements, stopSelector);

		return this;
	}

	prevUntil(stopSelector: string) {
		this.elements = DOMTraverse.prevUntil(this.elements, stopSelector);

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

	click(handler: () => any) {
		EventHandling.on(this.elements, 'click', handler);

		return this;
	}

	dblclick(handler: () => any) {
		EventHandling.on(this.elements, 'dblclick', handler);

		return this;
	}

	mouseenter(handler: () => any) {
		EventHandling.on(this.elements, 'mouseenter', handler);

		return this;
	}

	mouseleave(handler: () => any) {
		EventHandling.on(this.elements, 'mouseleave', handler);

		return this;
	}

	mousedown(handler: () => any) {
		EventHandling.on(this.elements, 'mousedown', handler);

		return this;
	}

	mouseup(handler: () => any) {
		EventHandling.on(this.elements, 'mouseup', handler);

		return this;
	}

	focus(handler: () => any) {
		EventHandling.on(this.elements, 'focus', handler);

		return this;
	}

	blur(handler: () => any) {
		EventHandling.on(this.elements, 'blur', handler);

		return this;
	}

	hover(handleMouseEnter: () => any, handleMouseLeave: () => any) {
		EventHandling.on(this.elements, 'mouseenter', handleMouseEnter);
		EventHandling.on(this.elements, 'mouseleave', handleMouseLeave);

		return this;
	}
}

export default JQuery;

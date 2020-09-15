import Events, { OnMultipleEvents } from './Events';
import JQuery, { PropName } from './JQuery';

interface I$ {
	(prop: PropName): JQuery;
	ready(fn: () => any): void;
	on(event: string, handler: () => any): void;
	on(event: OnMultipleEvents): void;
}

const $: I$ = (prop) => new JQuery(prop);

$.ready = (fn) => {
	window.addEventListener('DOMContentLoaded', fn);
};

$.on = (event: any, handler?: any) => {
	Events.on([window], event, handler);
};

export default $;

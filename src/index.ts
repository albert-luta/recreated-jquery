import EventHandling, { OnMultipleEvents } from './EventHandling';
import JQuery, { PropName } from './JQuery';

interface I$ {
	(prop: PropName): JQuery;
	ready(fn: () => any): void;
	on(event: string, handler: () => any): void;
	on(event: OnMultipleEvents): void;
}

const $: I$ = (prop) => new JQuery(prop);

$.ready = (handler) => {
	EventHandling.on([window], 'DOMContentLoaded', handler);
};

$.on = (event: any, handler?: any) => {
	EventHandling.on([window], event, handler);
};

export default $;

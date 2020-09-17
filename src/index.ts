import DOMNewElements from './DOMNewElements';
import EventHandling, { OnMultipleEvents, EventHandler } from './EventHandling';
import Http, { HttpConfig, HeadersOrConfig, Body } from './Http';
import JQuery, { PropName } from './JQuery';

interface I$ {
	(prop: PropName): JQuery;
	ready(handler: EventHandler): void;

	on(event: string, handler: EventHandler): void;
	on(event: OnMultipleEvents): void;

	create(element: string): JQuery;

	http(config: HttpConfig): Http;
	get(
		path: string,
		customHeaders?: HeadersOrConfig,
		customConfig?: HeadersOrConfig
	): Promise<any>;
	post(
		path: string,
		body?: Body,
		customHeaders?: HeadersOrConfig,
		customConfig?: HeadersOrConfig
	): Promise<any>;
}

const $: I$ = (prop) => new JQuery(prop);

$.ready = (handler) => {
	EventHandling.on([window], 'DOMContentLoaded', handler);
};

$.on = (event: any, handler?: any) => {
	EventHandling.on([window], event, handler);
};

$.create = (element) => DOMNewElements.create(element);

$.http = (config) => new Http(config);

$.get = (path, customHeaders, customConfig) => new Http().get(path, customHeaders, customConfig);

$.post = (path, body, customHeaders, customConfig) =>
	new Http().post(path, body, customHeaders, customConfig);

export default $;

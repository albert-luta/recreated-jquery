import JQuery, { PropName } from './JQuery';

const $ = (prop: PropName) => new JQuery(prop);

$.ready = (fn: () => any) => {
	document.addEventListener('DOMContentLoaded', fn);
};

export default $;

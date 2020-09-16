export type HeadersOrConfig = { [field: string]: string };
export type Body = { [field: string]: any };

export interface HttpConfig {
	baseUrl?: string;
	headers?: HeadersOrConfig;
}

enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
}

class Http {
	private baseUrl?: string;
	private headers: HeadersOrConfig = {
		'Content-Type': 'application/json',
	};

	constructor({ baseUrl, headers }: HttpConfig = {}) {
		this.baseUrl = baseUrl;
		this.headers = { ...this.headers, ...headers };
	}

	updateHeaders(headers: HeadersOrConfig) {
		this.headers = { ...this.headers, ...headers };
	}

	private async callApi(
		path: string,
		method: HttpMethod,
		customHeaders?: HeadersOrConfig,
		customConfig?: HeadersOrConfig,
		body?: Body
	) {
		const res = await fetch(new URL(path, this.baseUrl).toString(), {
			...customConfig,
			method,
			body: body ? JSON.stringify(body) : undefined,
			headers: { ...this.headers, ...customHeaders },
		});

		if (!res.ok) throw res;

		return await res.json();
	}

	get(path: string, customHeaders?: HeadersOrConfig, customConfig?: HeadersOrConfig) {
		return this.callApi(path, HttpMethod.Get, customHeaders, customConfig);
	}

	post(
		path: string,
		body?: Body,
		customHeaders?: HeadersOrConfig,
		customConfig?: HeadersOrConfig
	) {
		return this.callApi(path, HttpMethod.Post, customHeaders, customConfig, body);
	}
}

export default Http;

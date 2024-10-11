
type WebringData = {
	sites: SiteData[]
}

type SiteData = {
	url: string,
	creator?: string,
	banner?: string,
}

customElements.define('myth-ring', class extends HTMLElement {

	static observedAttributes = ["url"];

	private abort?: AbortSignal | null = null;

	private url: string | null = null;

	constructor() {

		super();

		this.url = this.getAttribute('url');


	}

	attributeChangedCallback(name: string, oldValue: any, newValue: any) {

		if (name === 'url') {

		}

	}

	connectedCallback() {

		this.url = this.getAttribute('url') ?? '';

		//this.attributes.getNamedItem('url');

		const shadowRoot = this.attachShadow({ mode: 'open' });


		const prevLink = shadowRoot.appendChild(
			document.createElement('a')
		);
		prevLink.href = 'www.youtube.com';
		prevLink.innerText = 'Initial link';

		this.fetchAndUpdate();

		const nextLink = shadowRoot.appendChild(document.createElement('a'));


	}

	async fetchListData() {

		if (!this.url) {
			return null;
		}

		try {

			const headers = new Headers();
			headers.append('Accept', 'text/plain');

			const resp = await fetch(
				this.url,
				{
					method: 'get',
					headers,
					mode: 'cors',
					keepalive: false

				});
			console.log(`fetch status: ${resp.statusText}`);

			const data = await resp.json() as WebringData;

			return data.sites;

		} catch (err) {
			console.warn(`webring failed to load: ${err}`);
			return null;
		}

	}

	async fetchAndUpdate() {

		const sites = await this.fetchListData();

		if (!sites) return;

		try {

			for (const site of sites) {

				console.log(`found link: ${site.url}`);
				const elm = document.createElement('a');
				elm.href = site.url;
				elm.innerText = site.url;
				this.shadowRoot?.appendChild(elm);
			}

		} catch (err) {
			console.warn(`webring data failed to load: ${err}`);
		}

	}

	disconnectedCallback() {
		console.log(`webring disconnected`);
	}

});
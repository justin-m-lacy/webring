
type WebringData = {
	sites: SiteData[]
}

type SiteData = {
	url: string,
	title?: string,
	creator?: string,
	banner?: string,
}

customElements.define('myth-ring', class extends HTMLElement {

	static observedAttributes = ["url"];

	//private abort?: AbortSignal | null = null;

	private url: string | null = null;

	constructor() {
		super();
	}

	attributeChangedCallback(name: string, oldValue: any, newValue: any) {

		if (name === 'url') {
			this.url = newValue;
		}

	}

	connectedCallback() {

		this.attachShadow({ mode: 'open' });

		this.url = this.getAttribute('url');

		if (this.url != null) {
			this.fetchLinksAndUpdate();
		}

	}

	async fetchListData() {

		try {

			if (!this.url) return null;

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

			const data = await resp.json() as WebringData;

			return data.sites;

		} catch (err) {
			console.warn(`webring data load failed: ${err}`);
			return null;
		}

	}

	private getSiteIndex(sites: SiteData[]) {

		const indexKey = this.getAttribute("index") ?? window.origin;
		let index = Number(indexKey);
		if (Number.isNaN(index)) {

			index = sites.findIndex(v => v.url === indexKey);
			return index >= 0 ? index : null;

		} else {
			return index;
		}

	}

	private makeSiteLink(sites: SiteData[], index: number) {

		index = index % sites.length;
		if (index < 0) {
			index = (index + sites.length) % sites.length;
		}
		const site = sites[index];

		const elm = document.createElement('a');
		elm.href = site.url;
		elm.innerText = `${site.title ?? site.url}`;

		return elm;

	}

	async fetchLinksAndUpdate() {

		const sites = await this.fetchListData();

		if (!sites) return;

		try {

			const curIndex = this.getSiteIndex(sites);
			const useIndex = curIndex !== null ?
				curIndex : Math.floor(Math.random() * sites.length);

			console.log(`found ind: ${curIndex}`);
			console.log(`use index: ${useIndex}`);

			const prevLink = this.makeSiteLink(sites, useIndex - 1);
			this.shadowRoot?.appendChild(prevLink);
			if (curIndex !== null) {
				this.shadowRoot?.appendChild(this.makeSiteLink(sites, curIndex));
			}
			this.shadowRoot?.appendChild(
				this.makeSiteLink(sites, useIndex + 1)
			);


		} catch (err) {
			console.warn(`webring data failed to load: ${err}`);
		}

	}

	disconnectedCallback() {
		console.log(`webring disconnected`);
	}

});
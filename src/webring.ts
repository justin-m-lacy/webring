import list from "../rings/test/list.json";

type WebringData = {
	sites: SiteData[]
}

type SiteData = {
	url: string,
	title?: string,
	creator?: string,
	banner?: string,
}

const template = document.createElement('template');
template.innerHTML = `
<style>
.base {
	display: flex;
	justify-content: space-evenly;
}
.weblink {
	padding:8px 0;
}
.curlink {
}
</style>
<div class="base">
<slot name="prevsite">
<a class="weblink" href="{{url}}">{{ title}}</a>
</slot>
<slot name="nextsite">
<a class="weblink" href="{{url}}">{{ title}}</a>
</slot>
</div>`;

/// Variable placeholder in slots.
const varRegex = /\{\{\s*(\w+)\s*\}\}/g
customElements.define('myth-ring', class extends HTMLElement {

	static observedAttributes = ["url"];

	//private abort?: AbortSignal | null = null;

	private sites: SiteData[] | null = null;

	prevSite: SiteData | null = null;

	nextSite: SiteData | null = null;

	/**
	 * Node holding the <webring> template.
	 */
	private templateNode: Node | null = null;

	private url: string | null = null;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot!.addEventListener('slotchange', (evt: Event) => {

			const slot = evt.target as HTMLSlotElement;
			console.log(`slot changed: ${slot.name}`);
		});

	}

	attributeChangedCallback(name: string, oldValue: any, newValue: any) {

		if (oldValue == newValue) return;

		if (name === 'index') {

		} else if (name === 'url') {

			console.log(`url changed: ${oldValue}->${newValue}`);
			this.url = newValue;
			this.fetchLinksAndUpdate()

		}

	}

	private cloneTemplate() {
		this.templateNode ??= this.shadowRoot?.appendChild(
			template.content.cloneNode(true)
		) ?? null;
	}

	connectedCallback() {

		this.url = this.getAttribute('url');
		if (this.url != null) {
			this.fetchLinksAndUpdate();
		}

	}

	async fetchListData() {

		return list.sites;

		try {

			if (!this.url) return null;

			const headers = new Headers();
			headers.append('Accept', 'text/plain');

			const resp = await fetch(
				this.url!,
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

	/**
	 * Get index of currently viewed site.
	 * @param sites 
	 * @returns 
	 */
	private getMyIndex(sites: SiteData[]) {

		const indexKey = this.getAttribute("index") ?? window.origin;
		let index = Number(indexKey);
		if (Number.isNaN(index)) {

			index = sites.findIndex(v => v.url === indexKey);
			return index >= 0 ? index : null;

		} else {
			/// negative mod.
			return index;
		}

	}

	private setSiteLink(slot: 'prevsite' | 'nextsite', site: SiteData | null) {

		const elm = this.shadowRoot!.querySelector(`slot[name="${slot}"]`) as HTMLElement;
		if (site === null) {
			elm.innerHTML = '';
		} else if (elm.textContent) {
			elm.innerHTML = elm.innerHTML.replace(varRegex, (substr, grp1, ...args) => {

				if (grp1 === 'title') return site.title ?? site.url;
				else if (grp1 in site) {
					return site[grp1 as keyof SiteData] ?? '';
				}
				return substr;

			})
		}

	}

	private setSiteIndices() {

		const sites = this.sites;
		if (!sites) return;

		const curIndex = this.getMyIndex(sites);
		const count = sites.length;

		// If current site not found in ring, use random index.
		let index = curIndex !== null ?
			curIndex - 1 : Math.floor(Math.random() * count);
		/// negative block
		index = ((index % count) + count) % count;

		this.prevSite = sites[index];
		/// skip current site.
		if (curIndex !== null) index = (index + 1) % count;
		this.nextSite = sites[index];

	}

	async fetchLinksAndUpdate() {

		this.sites = await this.fetchListData();

		if (!this.sites || !this.shadowRoot) return;

		try {

			setTimeout(() => {

				console.log(`setting INDEXES`);
				this.cloneTemplate();
				this.setSiteIndices();
				console.log(`CHANGING SLOTS`);
				this.setSiteLink('prevsite', this.prevSite);
				this.setSiteLink('nextsite', this.nextSite);


			}, 1000);


		} catch (err) {
			console.warn(`webring data failed to load: ${err}`);
		}

	}

	disconnectedCallback() {
		this.prevSite = null;
		this.nextSite = null;
		this.templateNode = null;
		this.sites = null;
	}

});
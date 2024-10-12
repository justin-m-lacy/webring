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
<slot name="prevsite">
<a class="weblink" href="{{url}}">{{ title}}</a>
</slot>
<slot name="cursite">
<a class="weblink" href="{{url}}">{{ title}}</a>
</slot>
<slot name="nextsite">
<a class="weblink" href="{{url}}">{{ title}}</a>
</slot>`;

/// Variable placeholder in slots.
const varRegex = /\{\{\s*(\w+)\s*\}\}/g
customElements.define('myth-ring', class extends HTMLElement {

	static observedAttributes = ["url"];

	//private abort?: AbortSignal | null = null;

	private prevSite: SiteData | null = null;
	private curSite: SiteData | null = null;
	private nextSite: SiteData | null = null;

	private sites: SiteData[] | null = null;

	private url: string | null = null;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot!.addEventListener('slotchange', (evt: Event) => {

			console.log(`slot changed: ${evt.target}`);
			console.dir(evt.target);
			console.log(`slot name: ${(evt.target as HTMLElement).innerHTML}`)


		});

	}

	attributeChangedCallback(name: string, oldValue: any, newValue: any) {

		if (oldValue == newValue) return;

		if (name === 'index') {

		} else if (name === 'url') {

			this.url = newValue;
			this.fetchLinksAndUpdate()

		}

	}

	connectedCallback() {

		const base = this.shadowRoot!.appendChild(
			template.content.cloneNode(true)
		) as HTMLElement;

		base.classList.add('base');

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

	private getCurSiteIndex(sites: SiteData[]) {

		const indexKey = this.getAttribute("index") ?? window.origin;
		let index = Number(indexKey);
		if (Number.isNaN(index)) {

			index = sites.findIndex(v => v.url === indexKey);
			return index >= 0 ? index : null;

		} else {
			return index;
		}

	}

	private setSiteLink(slot: 'prevsite' | 'cursite' | 'nextsite', index: number) {

		const sites = this.sites;
		if (!sites) return;

		index = index % sites.length;
		if (index < 0) {
			index = (index + sites.length) % sites.length;
		}
		const site = sites[index];
		const elm = this.shadowRoot!.querySelector(`slot[name="${slot}"]`) as HTMLElement;

		if (elm.textContent) {
			elm.textContent.replace(varRegex, (substr, ...args) => {

				if (substr in site) {
					return site[substr as keyof SiteData] ?? '';
				}
				return substr;

			})
		}


		/*const elm = document.createElement('a');
		elm.classList.add('weblink')
		elm.href = site.url;
		elm.innerText = `${site.title ?? site.url}`;*/

	}

	async fetchLinksAndUpdate() {

		const sites = this.sites = await this.fetchListData();

		if (!sites || !this.shadowRoot) return;

		try {

			const curIndex = this.getCurSiteIndex(sites);
			// Current site might not be in the webring.
			// Show random prev/next links.
			const useIndex = curIndex !== null ?
				curIndex : Math.floor(Math.random() * sites.length);

			this.setSiteLink('prevsite', useIndex - 1);

			if (curIndex !== null) {
				this.setSiteLink('cursite', curIndex)
			}

			this.setSiteLink('nextsite', curIndex !== null ? curIndex + 1 : useIndex)


		} catch (err) {
			console.warn(`webring data failed to load: ${err}`);
		}

	}

	disconnectedCallback() {
		console.log(`webring disconnected`);
	}

});
const DEFAULT_RING_URL = 'https://okprco.com/webring/rings/test/sites.json';

type WebringData = {
	sites: SiteData[]
}

type SiteData = {
	url: string,
	title?: string,
	icon?: string,
	creator?: string,
	banner?: string,
}


const linkTemplate = document.createElement('template');
linkTemplate.innerHTML = '<a class="weblink" part="link" href="{{url}}">{{title}}</a>';

const template = document.createElement('template');
template.innerHTML = `
<style>
.hide {display:none;}
:host {
	display:flex;
	width: 80%;
	border: 1px solid black;
	border-radius: 8px;
	padding: 8px 0;
	gap: 32px;
	justify-content: center;
}
</style>
<slot name="prevsite"></slot>
<slot name="cursite"></slot>
<slot name="nextsite"></slot>`;

const sanitizeResults = (sites: Partial<SiteData>[] | null | undefined) => {

	const results: SiteData[] = [];
	if (sites == null || sites.length === 0) return results;

	for (const site of sites) {

		if (!site || !site.url || typeof site.url !== 'string') continue;
		if (!site.url.startsWith('http')) site.url = "https://" + site.url;
		results.push(site as SiteData);

	}

	return results;

}

/// Variable placeholder in slots.
const slotVarRegex = /\{\{\s*(\w+)\s*\}\}/g
customElements.define('myth-ring', class extends HTMLElement {

	static observedAttributes = ["url", "index"];

	private sites: SiteData[] | null = null;

	private curSite: SiteData | null = null;

	private prevSite: SiteData | null = null;

	private nextSite: SiteData | null = null;

	private slotsCount: number = 3;

	private slotsUpdating = 0;

	attributeChangedCallback(name: string, oldValue: any, newValue: any) {

		if (oldValue == newValue) return;

		if (name === 'index') {
			this.refreshLinks();
		} else if (name === 'url') {
			this.fetchSiteList(newValue).then(() => this.refreshLinks());
		}

	}

	connectedCallback() {

		this.attachShadow({ mode: 'open' });
		if (!this.shadowRoot) {
			console.warn(`webring missing root`);
			return;
		}

		this.shadowRoot.appendChild(
			template.content.cloneNode(true)
		);
		this.slotsCount = this.shadowRoot.querySelectorAll("slot").length;

		this.shadowRoot.addEventListener('slotchange', (evt: Event) => {

			if (!this.isConnected || !this.sites) return;
			const slot = evt.target as HTMLSlotElement;

			if (slot.name === 'prevsite' || slot.name === 'nextsite' || slot.name === 'cursite') {
				this.setSiteLink(slot.name);
			}

		});

		if (this.sites) {
			this.refreshLinks();
		} else if (!this.getAttribute('url')) {
			/// url attribute would load on attribute changed.
			this.fetchSiteList(DEFAULT_RING_URL).then(() => {
				this.refreshLinks()
			});

		}

	}

	async fetchSiteList(url: string | null) {

		try {
			if (!url) return null;

			const headers = new Headers();
			headers.append('Accept', 'text/*');

			const resp = await fetch(
				url!,
				{
					method: 'get',
					headers,
					mode: 'cors',
					keepalive: false

				});

			const data = await resp.json() as WebringData | null | undefined;

			console.log(`loaded site list...`);
			console.dir(data);

			this.sites = sanitizeResults(data?.sites);

		} catch (err) {
			console.warn(`webring data load failed: ${err}`);
			return null;
		}

	}

	/**
	 * Get index of this (current) site.
	 * @param sites 
	 * @returns 
	 */
	private getMyIndex(sites: SiteData[]) {

		const indexKey = this.getAttribute("index") ?? document.URL;

		console.log(`document: ${document.URL}`);

		let index = Number(indexKey);
		if (Number.isNaN(index)) {

			index = sites.findIndex(v => v.url.includes(indexKey));
			return index >= 0 ? index : null;

		} else {
			return index;
		}

	}

	private setSiteLink(slotName: 'prevsite' | 'nextsite' | 'cursite') {

		// block slotchange infinite update loop.
		if (this.slotsUpdating >= this.slotsCount) return;
		this.slotsUpdating++;
		if (this.slotsUpdating === 1) {
			setTimeout(() => {
				this.slotsUpdating = 0;
			});
		}

		const siteData = slotName === 'prevsite' ? this.prevSite :
			(slotName === 'cursite' ? this.curSite : this.nextSite);
		const slot = this.shadowRoot!.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement;

		if (siteData === null) {
			slot.classList.add('hide');
			return;
		} else {
			slot.classList.remove('hide');
		}


		//console.log(`getting site: ${slotName}: DATA: ${siteData.url}`);
		const replaceVars = (substr: string, grp1: string, ..._: any[]) => {
			if (grp1 === 'title') return siteData.title ?? siteData.url;
			else if (grp1 in siteData) {
				return siteData[grp1 as keyof SiteData] ?? '';
			}
			return substr;
		}

		const assigned = slot.assignedElements();
		if (assigned.length === 0) {

			/// Slot is empty.

			slot.childNodes.forEach(v => v.remove());
			const linkNode = linkTemplate.content.cloneNode(true);
			linkNode.childNodes.forEach(elm => {
				if (elm instanceof HTMLElement) {
					elm.innerHTML = elm.innerHTML.replace(slotVarRegex, replaceVars);
				}
			});
			slot.appendChild(linkNode);

		} else {
			assigned.forEach(elm => {
				elm.innerHTML = elm.innerHTML.replace(slotVarRegex, replaceVars);
			});
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
		index = (index + 1) % count;

		if (curIndex !== null) {
			this.curSite = sites[index];
			index = (index + 1) % count;
		} else {
			this.curSite = null;
		}

		this.nextSite = sites[index];

	}

	refreshLinks() {

		if (!this.isConnected || !this.sites) return;

		this.setSiteIndices();
		this.setSiteLink('prevsite');
		this.setSiteLink('cursite');
		this.setSiteLink('nextsite');

	}

	disconnectedCallback() {
		this.prevSite = null;
		this.curSite = null;
		this.nextSite = null;
		this.sites = null;
	}

});
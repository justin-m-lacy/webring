const DEFAULT_RING_URL = 'https://okprco.com/webring/rings/test/sites.json';

type WebringData = {
	sites: SiteData[]
}

type SiteData = {
	url: string,
	title?: string,
	creator?: string,
	banner?: string,
}


const linkTemplate = document.createElement('template');
linkTemplate.innerHTML = '<a class="weblink" href="{{url}}">{{title}}</a>';

const template = document.createElement('template');
template.innerHTML = `
<style>
.hide {
display:none;
}
.base {
	display:flex;
	justify-content: space-evenly;
}
.weblink {
	padding:8px 0;
}
</style>
<div class="base">
<slot name="prevsite"></slot>
<slot name="nextsite"></slot>
</div>`;

/// Variable placeholder in slots.
const slotVarRegex = /\{\{\s*(\w+)\s*\}\}/g
customElements.define('myth-ring', class extends HTMLElement {

	static observedAttributes = ["url", "index"];

	private sites: SiteData[] | null = null;

	private prevSite: SiteData | null = null;

	private nextSite: SiteData | null = null;

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
		this.shadowRoot.addEventListener('slotchange', (evt: Event) => {

			if (!this.isConnected || !this.sites) return;
			const slot = evt.target as HTMLSlotElement;
			if (slot.name === 'prevsite' || slot.name === 'nextsite') {
				this.setSiteLink(slot.name);
			}

		});

		if (this.sites) {
			this.refreshLinks();
		} else if (!this.getAttribute('url')) {
			this.fetchSiteList(DEFAULT_RING_URL).then(() => this.refreshLinks());

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

			const data = await resp.json() as WebringData;
			this.sites = data.sites;

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

	private setSiteLink(slotName: 'prevsite' | 'nextsite') {

		if (this.slotsUpdating >= 2) return;
		this.slotsUpdating++;
		setTimeout(() => {
			this.slotsUpdating = 0;
		});

		const siteData = slotName === 'prevsite' ? this.prevSite : this.nextSite;
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
		/// skip current site.
		index = curIndex != null ? (index + 1) % count : (index + 2) % count;
		this.nextSite = sites[index];

	}

	refreshLinks() {

		if (!this.isConnected || !this.sites) return;

		this.setSiteIndices();
		this.setSiteLink('prevsite');
		this.setSiteLink('nextsite');

	}

	disconnectedCallback() {
		this.prevSite = null;
		this.nextSite = null;
		this.sites = null;
	}

});
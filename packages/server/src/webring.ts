import { SiteData, WebringData } from '@shared/webring.js';

export function removeSite(ring: WebringData, url: string) {

	const ind = ring.sites.findIndex((site) => site.url == url);
	if (ind >= 0) {
		ring.sites.splice(ind, 1);
		return true;
	}
	return false;

}

export function addSite(ring: WebringData, site: SiteData) {

	if (ring.sites.some(v => v.url === site.url)) {
		return false;
	}

	ring.sites.push(site);

	return true;

}

export function updateSite(ring: WebringData, target: string, values: Partial<SiteData>) {

	const index = ring.sites.findIndex((site) => site.url == target);
	if (index < 0) return false;

	const site = ring.sites[index];
	let prop: keyof SiteData;
	for (prop in values) {
		const val = values[prop];
		if (val) {
			site[prop] = val;
		}
	}

	return true;

}

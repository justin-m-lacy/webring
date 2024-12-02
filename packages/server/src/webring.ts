export type WebringData = {
	sites: SiteData[]
}

export type SiteData = {
	url: string,
	title?: string,
	icon?: string,
	creator?: string,
	banner?: string,
}

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
	for (const prop in values) {
		site[prop] = values[prop];
	}

	return true;

}

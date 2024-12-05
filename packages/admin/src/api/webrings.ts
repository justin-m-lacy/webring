import { SiteData, WebringData } from "@shared/webring";

const RingHost = import.meta.env.VITE_RING_HOST;

export async function fetchRingIds(): Promise<string[]> {

	const res = await fetch(`${RingHost}/rings`, {
		method: 'GET',
		credentials: 'include',
	});

	if (res.status !== 200) throw new Error(res.statusText);

	const ringIds = await res.json() as { rings: string[] };
	return ringIds.rings;

}

export async function fetchRingData(ringId: string): Promise<WebringData> {

	const res = await fetch(`${RingHost}/rings/${ringId}`, {
		method: 'GET',

		credentials: 'include'
	});

	if (res.status !== 200) throw new Error(res.statusText);

	const ringData = await res.json() as { ring: WebringData };
	return ringData.ring;

}

export async function createRing(ringId: string): Promise<true> {

	const res = await fetch(`${RingHost}/rings`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({ ringid: ringId })
	});

	if (res.status !== 200) {
		throw new Error(res.statusText);
	}
	return true;

}

export async function createSite(ringId: string, site: SiteData): Promise<string> {

	const res = await fetch(`${RingHost}/rings`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({ ringid: ringId, site })
	});

	if (res.status !== 200) {
		throw new Error(res.statusText);
	}
	const data = await res.json() as { siteid: string };
	return data.siteid;

}

export async function deleteRing(ringId: string): Promise<true> {

	const res = await fetch(`${RingHost}/rings`, {
		method: 'DELETE',
		credentials: 'include',
		body: JSON.stringify({ ringid: ringId })
	});

	if (res.status !== 200) {
		throw new Error(res.statusText);
	}
	return true;

}

export async function deleteSite(ringId: string, siteId: string): Promise<true> {

	const res = await fetch(`${RingHost}/rings/${ringId}/sites/${siteId}`, {
		method: 'DELETE',
		credentials: 'include'
	});

	if (res.status !== 200) {
		throw new Error(res.statusText);
	}
	return true;

}
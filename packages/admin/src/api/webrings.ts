import { SiteData, WebringData } from "@shared/webring";

const RingHost = import.meta.env.VITE_RING_HOST;

/// appends Content-Type: 'application/json' header
const jsonHeaders = (headers: Array<[string, string]> = []) => {

	headers.push(['Content-Type', 'application/json']);
	return headers;

}

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
		headers: jsonHeaders(),
		body: JSON.stringify({ ringid: ringId })
	});

	if (res.status !== 200) {
		throw new Error(res.statusText);
	}
	return true;

}

export async function createSite(ringId: string, site: SiteData): Promise<string> {

	const res = await fetch(`${RingHost}/rings/${ringId}/sites`, {
		method: 'POST',
		credentials: 'include',
		headers: jsonHeaders(),
		body: JSON.stringify({ site })
	});

	if (res.status !== 200) {
		throw new Error(res.statusText);
	}
	const data = await res.json() as { siteid: string };
	return data.siteid;

}

export async function deleteRing(ringId: string): Promise<true> {

	const res = await fetch(`${RingHost}/rings/${ringId}`, {
		method: 'DELETE',
		credentials: 'include'
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
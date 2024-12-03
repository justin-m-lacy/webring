import { WebringData } from "@shared/webring";

const RingHost = import.meta.env.VITE_RING_HOST;

export async function fetchRingIds(): Promise<string[]> {

	const res = await fetch(`${RingHost}/rings`, {
		method: 'GET',
		credentials: 'include'
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
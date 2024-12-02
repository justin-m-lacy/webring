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
import { SiteData, WebringData } from "@shared/webring.js";
import { randomUUID } from 'crypto';
import { createNewRing, deleteRingIo, loadRing, writeRing } from "./io/ring-io.js";
import { useWebringList } from './webring-list.js';

let ringCache: ReturnType<typeof createCache> | null = null;

const ringListStore = useWebringList();

const createCache = () => {

	const ringCache = new Map<string, WebringData>();
	const getOrLoad = async (ringId: string): Promise<WebringData | null> => {

		const cur = ringCache.get(ringId);
		if (cur) return cur;

		try {

			const ring = await loadRing(ringId);
			ringCache.set(ringId, ring);

			return ring;

		} catch (err) {
			console.error(err);
		}

		return null;

	}

	const addSite = async (ringId: string, data: Omit<SiteData, 'id'>) => {

		const ring = ringCache.get(ringId);
		if (!ring) return;

		const siteId = randomUUID();

		ring.sites.push({
			id: siteId,
			...data
		})

		await writeRing(ring.id, ring);

		return siteId;

	}

	const newRing = async (ringId: string) => {

		if (ringCache.has(ringId)) return false;
		const data = { id: ringId, sites: [] };
		createNewRing(ringId, data);

		ringListStore.addRing(ringId);
		ringCache.set(ringId, data);

	}

	const deleteRing = async (ringId: string) => {

		await deleteRingIo(ringId);
		ringCache.delete(ringId);
		ringListStore.removeRing(ringId);

	}

	const saveRing = (ring: WebringData) => {
		if (ring) {
			writeRing(ring.id, ring);
		}

	}

	const clearStore = (ringId: string) => {
		ringCache.delete(ringId);
	}

	return {
		getOrLoad,
		saveRing,
		addSite,
		clearStore,
		newRing,
		deleteRing
	}

}

export const useRingCache = () => {
	return ringCache ?? (ringCache = createCache());
}
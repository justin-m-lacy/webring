import { ErrorDuplicate, ErrorNotFound } from "@/errors.js";
import { SiteData, WebringData } from "@shared/webring.js";
import { createNewRing, loadRing, writeRing } from "./ring-io.js";
import { useWebringList } from './webring-list.js';

let ringStore: ReturnType<typeof createStore> | null = null;

const ringListStore = useWebringList();

const createStore = () => {

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

	const addSite = async (ringId: string, siteId: string, data: SiteData) => {

		const ring = await getOrLoad(ringId);
		if (ring == null) throw new ErrorNotFound();
		const site = ring.sites.find(s => s.id === siteId);
		if (site) throw new ErrorDuplicate();

		await writeRing(ring.id, ring);

		ring.sites.push(data);

	}

	const createNew = async (ringId: string) => {

		if (ringCache.has(ringId)) return false;
		const data = { id: ringId, sites: [] };
		createNewRing(ringId, data);

		ringListStore.addRing(ringId);
		ringCache.set(ringId, data);

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
		createNew
	}

}

export const useRingStore = () => {
	return ringStore ?? (ringStore = createStore());
}
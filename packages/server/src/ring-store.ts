import { WebringData } from "@shared/webring.js";
import { createNewRing, loadRing, writeRing } from "./ring-io.js";
import { useWebringList } from './webring-list.js';

let ringStore: ReturnType<typeof createStore> | null = null;

const ringListStore = useWebringList();

const createStore = () => {

	const ringCache = new Map<string, WebringData>();
	const getOrLoad = async (ringId: string) => {

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

	const createNew = async (ringId: string) => {

		if (ringCache.has(ringId)) return false;
		const data = { id: ringId, sites: [] };
		createNewRing(ringId, data);

		ringListStore.addRing(ringId);
		ringCache.set(ringId, data);

	}

	const saveRing = (ringId: string) => {

		const data = ringCache.get(ringId);
		if (data) {
			writeRing(ringId, data);
		}

	}

	const clearStore = (ringId: string) => {
		ringCache.delete(ringId);
	}

	return {
		getOrLoad,
		saveRing,
		clearStore,
		createNew
	}

}

export const useRingStore = () => {
	return ringStore ?? (ringStore = createStore());
}
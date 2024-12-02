import { loadRing, writeRing } from "./ring-load";
import { WebringData } from "./webring";

let ringStore: ReturnType<typeof createStore> | null = null;

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
		clearStore
	}

}

export const useRingStore = () => {
	return ringStore ?? (ringStore = createStore());
}
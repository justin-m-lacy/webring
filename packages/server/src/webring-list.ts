import { loadRingList } from "./io/ring-io.js";

let webringsStore: ReturnType<typeof createStore> | null = null;

const createStore = () => {

	let ringsList: null | string[] = null;

	const addRing = (ringId: string) => {
		ringsList ??= [];
		if (!ringsList.includes(ringId)) {
			ringsList.push(ringId);
		}
	}

	const removeRing = (ringId: string) => {

		const ind = ringsList?.indexOf(ringId) ?? -1;
		if (ind >= 0) {
			ringsList!.splice(ind, 1);
		}

	}

	const load = async () => {
		return (ringsList = await loadRingList());
	}

	const getOrLoad = async () => {
		if (!ringsList) {
			ringsList = await loadRingList();
		}
		return ringsList
	}

	return {
		getOrLoad,
		addRing,
		removeRing,
		load,
	}

}

export const useWebringList = () => {
	return webringsStore ?? (webringsStore = createStore());
}
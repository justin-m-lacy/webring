import { loadRingList } from "./ring-io.js";

let webringsStore: ReturnType<typeof createStore> | null = null;

const createStore = () => {

	let ringsList: null | string[] = null;

	const addRing = (ringId: string) => {
		ringsList ??= [];
		if (!ringsList.includes(ringId)) {
			ringsList.push(ringId);
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
		load,
	}

}

export const useWebringList = () => {
	return webringsStore ?? (webringsStore = createStore());
}
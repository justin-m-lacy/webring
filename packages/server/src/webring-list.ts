import { loadRingList } from "./ring-load";

let webringsStore: ReturnType<typeof createStore> | null = null;

const createStore = () => {

	let ringsList: null | string[] = null;

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
		load
	}

}

export const useWebringList = () => {
	return webringsStore ?? (webringsStore = createStore());
}
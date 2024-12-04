import { fetchRingIds } from "@/api/webrings";
import { defineStore } from "pinia";

export const useRingList = defineStore('rings', () => {

	const webringIds = ref<string[]>();

	/**
	 * Adds ring to local list.
	 */
	function addRingLocal(ringId: string) {
		webringIds.value ??= [];
		if (!webringIds.value.includes(ringId)) {
			webringIds.value.push(ringId);
		}
	}

	function removeRingLocal(ringId: string) {
		const ind = webringIds.value?.indexOf(ringId) ?? -1;
		if (ind >= 0) {
			webringIds.value?.splice(ind, 1);
		}
	}

	async function loadRingList() {

		try {
			const ids = await fetchRingIds();
			webringIds.value = ids;
		} catch (err) {
			console.error(err);
		}

	}

	loadRingList();

	return {
		webringIds,
		addRingLocal,
		removeRingLocal,
		loadRingList
	}

});
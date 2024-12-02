import { fetchRingIds } from "@/api/webrings";
import { defineStore } from "pinia";

export const useRingListStore = defineStore('rings', () => {

	const webringIds = ref<string[]>();

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
		loadRingList
	}

});
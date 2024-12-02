import { fetchRingData } from "@/api/webrings";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { WebringData } from "../../../shared/webring";

export const useRingStore = defineStore('ring', () => {

	const curRingId = ref<string | null>(null);

	const webrings = ref(new Map<string, WebringData>());

	const curRing = computed(() => {
		const id = curRingId.value;
		return id ? webrings.value.get(id) : null;
	});

	async function loadRingData(id: string) {
		try {
			const ringData = await fetchRingData(id);
			webrings.value.set(id, ringData);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * debounced loading of current ring data
	 */
	const loadCurRing = useDebounceFn(async () => {

		const ringId = curRingId.value;
		if (ringId) await loadRingData(ringId);

	}, 200);

	function setCur(id: string | null) {

		curRingId.value = id;
		if (id) loadCurRing();

	}

	return {
		setCur,
		webrings,
		curRing,
		loadRingData,
		loadCurRing
	}

});
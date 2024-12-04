import { createRing, createSite, deleteSite, fetchRingData } from "@/api/webrings";
import { SiteData, WebringData } from "@shared/webring";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";

export const useRingStore = defineStore('ring', () => {

	const curRingId = ref<string | null>(null);

	const webrings = ref(new Map<string, WebringData>());

	const curRing = computed(() => {
		const id = curRingId.value;
		return id ? webrings.value.get(id) : null;
	});

	const createNew = useDebounceFn(async (ringId: string) => {

		try {
			const result = await createRing(ringId);
		} catch (err) {
			console.error(err);
		}

	}, 500);

	async function loadRingData(id: string) {
		try {
			const ringData = await fetchRingData(id);
			webrings.value.set(id, ringData);
		} catch (err) {
			console.error(err);
		}
	}

	async function addRingSite(ringId: string, siteData: SiteData) {

		const ring = webrings.value.get(ringId);
		if (!ring) return false;

		if (ring.sites.some(s => s.id === siteData.id || s.url === siteData.url)) {
			console.error(`Duplicate Ring: ${siteData.id}: ${siteData.url}`);
			return false;
		}

		createSite(ringId, siteData);


	}

	async function removeSite(ringId: string, siteId: string) {

		try {

			const ring = webrings.value.get(ringId);
			if (!ring) return;
			const ind = ring.sites.findIndex(s => s.id === siteId);

			if (ind < 0) return;

			await deleteSite(ringId, siteId);

			ring.sites.splice(ind, 1);

		} catch (err) {

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
		addRingSite,
		removeSite,
		loadRingData,
		loadCurRing,
		createNew
	}

});
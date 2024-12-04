import { createRing, createSite, deleteRing, deleteSite, fetchRingData } from "@/api/webrings";
import { useRingList } from "@/store/ring-list-store";
import { SiteData, WebringData } from "@shared/webring";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";

export const useRingStore = defineStore('ring', () => {

	const ringList = useRingList();

	const webrings = ref(new Map<string, WebringData>());

	const createNew = useDebounceFn(async (ringId: string) => {

		try {
			const result = await createRing(ringId);
		} catch (err) {
			console.error(err);
		}

	}, 500);

	function getRing(ringId: string) {
		return webrings.value.get(ringId);
	}

	function getSite(ringId: string, siteId: string) {
		return webrings.value.get(ringId)?.sites.find(s => s.id === siteId);
	}

	async function getOrLoad(ringId: string) {

		const ring = webrings.value.get(ringId);
		if (ring) return ring;

		await loadRing(ringId);
		return webrings.value.get(ringId);

	}

	async function loadRing(ringId: string) {
		try {
			const ringData = await fetchRingData(ringId);
			webrings.value.set(ringId, ringData);
		} catch (err) {
			console.error(err);
		}
	}

	async function addRingSite(ringId: string, siteData: SiteData) {

		const ring = webrings.value.get(ringId);
		if (!ring) return false;

		if (ring.sites.some(s => s.id === siteData.id || s.url === siteData.url)) {
			console.error(`Dupe Ring: ${siteData.id}: ${siteData.url}`);
			return false;
		}

		await createSite(ringId, siteData);

		ringList.addRingLocal(ringId);

	}

	async function removeRing(ringId: string) {

		try {

			const ring = webrings.value.get(ringId);
			if (!ring) return;

			await deleteRing(ringId);

			webrings.value.delete(ringId);

		} catch (err) {

		}

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

	return {
		webrings,
		getOrLoad,
		getRing,
		getSite,
		addRingSite,
		removeRing,
		removeSite,
		loadRing,
		createNew
	}

});
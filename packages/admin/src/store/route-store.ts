import { useRingStore } from "@/store/ring-store";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";

const ringStore = useRingStore();

export const useRouteStore = defineStore('route', () => {

	const viewRingId = ref<string>();
	const viewSiteId = ref<string>();

	/**
	 * debounced loading of current ring data
	 */
	const loadCurRing = useDebounceFn(async () => {

		const ringId = viewRingId.value;
		if (ringId) await ringStore.loadRing(ringId);

	}, 200);

	const viewRing = computed(() => {
		if (viewRingId.value) {
			return ringStore.getRing(viewRingId.value);
		}
		return null;
	});

	function setViewRing(ringId: string) {

		viewRingId.value = ringId;
		viewSiteId.value = undefined;
		loadCurRing();
	}

	function setViewSite(ringId: string, siteId: string) {
		viewSiteId.value = siteId;
		viewRingId.value = ringId;
	}

	const clearViewSite = () => {
		viewSiteId.value = undefined;
	}
	const clearViewRing = () => {
		viewRingId.value = undefined;
		viewSiteId.value = undefined;
	}

	return {
		viewRingId,
		viewRing,
		viewSiteId,
		setViewSite,
		setViewRing,
		clearViewRing,
		clearViewSite,
		loadCurRing
	}

});
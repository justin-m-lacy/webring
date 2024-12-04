import { useRingStore } from "@/store/ring-store";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";

const ringStore = useRingStore();

export const useRouteStore = defineStore('route', () => {

	const viewRingId = ref<string>();
	const viewSite = ref<string>();

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
		viewSite.value = undefined;
	}
	function setViewSite(ringId: string, siteId: string) {
		viewSite.value = siteId;
		viewRingId.value = ringId;
	}

	const clearViewSite = () => {
		viewSite.value = undefined;
	}
	const clearViewRing = () => {
		viewRingId.value = undefined;
		viewSite.value = undefined;
	}

	return {
		viewRingId,
		viewRing,
		viewSite,
		setViewSite,
		setViewRing,
		clearViewRing,
		clearViewSite,
		loadCurRing
	}

});
import { useRingStore } from "@/store/ring-store";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";

export type AdminRoute = 'main' | 'createRing' | 'createSite' | 'viewRing' | 'viewSite';

/**
 * Rudimentary/basic routing.
 */
export const useRouteStore = defineStore('route', () => {

	const ringStore = useRingStore();

	const viewRingId = ref<string>();
	const viewSiteId = ref<string>();

	const curRoute = ref<AdminRoute>('main');

	function createRing() {
		curRoute.value = 'createRing';
	}

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

		curRoute.value = 'viewRing';

		viewRingId.value = ringId;
		viewSiteId.value = undefined;

		loadCurRing();
	}

	function setViewSite(ringId: string, siteId: string) {
		curRoute.value = 'viewSite';
		viewSiteId.value = siteId;
		viewRingId.value = ringId;
	}

	const clearViewSite = () => {
		curRoute.value = 'main';
		viewSiteId.value = undefined;
	}
	const clearViewRing = () => {
		if (curRoute.value === 'viewRing' || curRoute.value === 'viewSite') {
			curRoute.value = 'main';
		}
		viewRingId.value = undefined;
		viewSiteId.value = undefined;
	}

	return {
		curRoute,
		viewRingId,
		viewRing,
		viewSiteId,
		setViewSite,
		setViewRing,
		createRing,
		clearViewRing,
		clearViewSite,
		loadCurRing
	}

});
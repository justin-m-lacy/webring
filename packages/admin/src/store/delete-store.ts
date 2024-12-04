import { useRingStore } from "@/store/ring-store";
import { useRouteStore } from "@/store/route-store";
import { defineStore } from "pinia";

export const useDeleteStore = defineStore('delete', () => {

	const deleting = ref(false);
	const deleteSiteId = ref<string | undefined>(undefined);
	const deleteRingId = ref<string | undefined>(undefined);

	async function deleteRing(ringId: string) {

		if (deleting.value) return;

		try {

			deleteRingId.value = ringId;
			deleteSiteId.value = undefined;

			await useRingStore().removeRing(ringId);

			const routeStore = useRouteStore();
			if (routeStore.viewRingId === ringId) {
				routeStore.clearViewRing();
			}

			deleting.value = true;

		} catch (err) {

		} finally {
			deleting.value = false
		}

	}

	async function deleteSite(ringId: string, siteId: string) {

		if (deleting.value) return;

		try {

			deleteRingId.value = ringId;
			deleteSiteId.value = siteId;

			await useRingStore().removeSite(ringId, siteId);

			const routeStore = useRouteStore();
			if (routeStore.viewRingId === ringId && routeStore.viewSiteId === siteId) {
				routeStore.clearViewSite();
			}

			deleting.value = true;

		} catch (err) {

		} finally {
			deleting.value = false
		}

	}

	function cancelDelete() {

		deleteRingId.value = undefined;
		deleteSiteId.value = undefined;
		deleting.value = false;

	}

	return {
		cancelDelete,
		deleteRing,
		deleteSite,
		deleting
	}


});
<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
import { useRingList } from './store/ring-list-store';
import RingView from '@/ui/RingView.vue';
import CreateRing from '@/ui/forms/CreateRing.vue';
import { useRouteStore } from './store/route-store';
import RingSelector from './ui/RingSelector.vue';
import SiteView from './ui/SiteView.vue';

const ringList = useRingList();
const ringStore = useRingStore();

const routeStore = useRouteStore();

const curRoute = computed(() => routeStore.curRoute);

function selectRing(ringId: string) {
	routeStore.setViewRing(ringId);
}

async function deleteSite(ringId: string, siteId: string) {

	await ringStore.removeSite(ringId, siteId);
	if (routeStore.viewRingId === ringId && routeStore.viewSiteId === siteId) {
		routeStore.clearViewSite();
	}

}

function viewSite(ringId: string, siteId: string) {
	routeStore.setViewSite(ringId, siteId);
}

function onCreated(ringId: string) {
	selectRing(ringId);
}

</script>
<template>
	<div>
		<div>Webring Admin</div>
		<RingSelector />
		<CreateRing v-if="curRoute === 'createRing'" @created="onCreated" />
		<RingView v-else-if="curRoute === 'viewRing'"
				  :ring-id="routeStore.viewRingId!"
				  @delete-site="deleteSite"
				  @select="viewSite" />
		<SiteView v-else-if="curRoute === 'viewSite'"
				  :ring-id="routeStore.viewRingId!"
				  :site-id="routeStore.viewSiteId!" />

	</div>
</template>
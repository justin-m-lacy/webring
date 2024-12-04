<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
import { useRingListStore } from './store/ring-list-store';
import RingView from '@/ui/RingView.vue';
import CreateRing from '@/ui/forms/CreateRing.vue';
import { useRouteStore } from './store/route-store';

const ringList = useRingListStore();
const ringStore = useRingStore();

const routeStore = useRouteStore();

const creating = ref(false);

function selectRing(ringId: string) {

	creating.value = false;
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

function goCreateNew() {
	creating.value = true;
}
function onCreated(ringId: string) {
	selectRing(ringId);
}

</script>
<template>
	<div>
		<div>Webring Admin</div>
		<div v-for="id in ringList.webringIds" @click="selectRing(id)" :key="id">
			{{ id }}
		</div>
		<button type="button" @click="goCreateNew()">[+]</button>
		<CreateRing v-if="creating" @created="onCreated" />
		<RingView v-else-if="routeStore.viewRing"
				  :ring="routeStore.viewRing"
				  @delete-site="deleteSite"
				  @select="viewSite" />
	</div>
</template>
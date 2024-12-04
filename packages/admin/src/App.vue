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

function viewSite(ringId: string, siteId: string) {

	routeStore.viewRingId = ringId;
	routeStore.viewSite = siteId;

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
				  @select="viewSite" />
	</div>
</template>
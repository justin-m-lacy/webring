<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
import { useRingListStore } from './store/ring-list-store';
import RingView from '@/ui/RingView.vue';
import CreateRing from '@/ui/CreateRing.vue';

const ringList = useRingListStore();
const ringStore = useRingStore();

const creating = ref(false);

function selectRing(id: string) {

	creating.value = false;
	ringStore.setCur(id);

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
		<RingView v-else-if="ringStore.curRing"
				  :ring="ringStore.curRing" />
	</div>
</template>
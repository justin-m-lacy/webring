<script setup lang="ts">
import { useRingList } from '@/store/ring-list-store';
import { useRouteStore } from '@/store/route-store';

const ringList = useRingList();
const routeStore = useRouteStore();

function createNew() {
	routeStore.createRing();
}

function selectRing(ringId: string) {
	routeStore.setViewRing(ringId);
}

</script>
<template>
	<div class="flex w-full cursor-pointer select-none space-x-2">
		<!--<div v-if="routeStore.viewRingId">
			<span>current Ring:</span>
			<span>{{ routeStore.viewRingId }}</span>
		</div>-->
		<div v-for="id in ringList.webringIds" :key="id"
			 :class="{
				'font-bold': id === routeStore.viewRingId,
			}"
			 @click="selectRing(id)">
			{{ id }}
		</div>
		<button type="button" @click="createNew()">[+]</button>
	</div>
</template>
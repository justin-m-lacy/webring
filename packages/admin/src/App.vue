<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
import { useRingListStore } from './store/ring-list-store';

const ringList = useRingListStore();
const ringStore = useRingStore();

function selectRing(id: string) {

}

</script>
<template>
	<div>
		<div>Webring Admin</div>
		<div v-for="id in ringList.webringIds" @click="selectRing(id)" :key="id">
			{{ id }}
		</div>
	</div>
</template>
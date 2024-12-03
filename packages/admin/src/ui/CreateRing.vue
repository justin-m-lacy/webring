<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
const ringStore = useRingStore();

const creating = ref(false);
const ringId = ref<string>();

async function tryCreate() {

	if (creating.value) return;
	if (!ringId.value) return;

	creating.value = true;
	ringStore.createNew(ringId.value);

}

</script>
<template>
	<div>

		<input type="text" v-model="ringId">
		<button type="button" :disabled="creating"
				@click="tryCreate">Create</button>
	</div>
</template>
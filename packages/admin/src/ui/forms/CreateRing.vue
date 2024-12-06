<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
import { useRouteStore } from '@/store/route-store';

const emits = defineEmits<{
	(e: 'created', id: string): void;
}>();

const ringStore = useRingStore();

const creating = ref(false);
const ringId = ref<string>();

async function tryCreate() {

	if (creating.value) return;

	const createId = ringId.value;
	if (!createId) return;

	try {
		creating.value = true;
		await ringStore.createNew(createId);

		emits('created', createId);

	} catch (err) {
		console.error(err);
	} finally {
		creating.value = false;
	}


}

function onCancel() {
	useRouteStore().curRoute = 'home';
}

</script>
<template>
	<div>

		<input type="text" v-model="ringId" placeholder="webring id">
		<button type="button" :disabled="creating"
				@click="tryCreate">Create</button>
		<button type="button" @click="onCancel">Cancel</button>
	</div>
</template>
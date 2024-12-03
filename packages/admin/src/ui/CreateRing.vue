<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';

const emits = defineEmits<{
	(e: 'created', id: string): void;
	(e: 'cancel'): void;
}>();

const ringStore = useRingStore();

const creating = ref(false);
const ringId = ref<string>();

async function tryCreate() {

	if (creating.value) return;

	const createId = ringId.value;
	if (!createId) return;

	creating.value = true;
	await ringStore.createNew(createId);

	creating.value = false;

	emits('created', createId);

}

</script>
<template>
	<div>

		<input type="text" v-model="ringId">
		<button type="button" :disabled="creating"
				@click="tryCreate">Create</button>
		<button type="button" @click="emits('cancel')">Cancel</button>
	</div>
</template>
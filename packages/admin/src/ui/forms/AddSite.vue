<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
import { ref } from 'vue';

const props = defineProps<{
	ringId: string
}>();
const ringStore = useRingStore();

const creating = ref(false);

const urlRef = ref('');
const titleRef = ref('');
const bannerRef = ref('');
const creatorRef = ref('');
const iconRef = ref('');

async function addSite() {

	const url = urlRef.value;
	const title = titleRef.value;

	if (!url || !title) return false;

	try {

		creating.value = true;

		await ringStore.addRingSite(props.ringId, {

			id: '',
			url,
			title,
			creator: creatorRef.value,
			banner: bannerRef.value,
			icon: iconRef.value

		});

	} catch (err) {

	} finally {
		creating.value = false;
	}

}

</script>
<template>
	<div>
		<div>{{ ringId }}: Add Site</div>

		<div>
			<input type="url" v-model="urlRef" placeholder="website url">
			<input type="text" v-model="titleRef" placeholder="website title">
			<input type="url" v-model="bannerRef" placeholder="website banner">

			<button type="button" @click="addSite">Submit</button>
		</div>
	</div>
</template>
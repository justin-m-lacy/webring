<script setup lang="ts">
import { useRingStore } from '@/store/ring-store';
import { useRouteStore } from '@/store/route-store';
import { ref } from 'vue';

const props = defineProps<{
	ringId: string
}>();

const routeStore = useRouteStore();
const ringStore = useRingStore();

const creating = ref(false);

const urlRef = ref('');
const titleRef = ref('');
const bannerRef = ref('');
const creatorRef = ref('');
const iconRef = ref('');

async function addSite() {

	if (creating.value) return;

	const url = urlRef.value;
	const title = titleRef.value;

	console.log(`adding site...: RING: ${props.ringId} ${url}`);
	if (!url || !title) return false;

	try {

		creating.value = true;

		const siteId = await ringStore.addRingSite(props.ringId, {

			id: '',
			url,
			title,
			creator: creatorRef.value,
			banner: bannerRef.value,
			icon: iconRef.value

		});

		console.log(`created: ${siteId}`);
		if (typeof siteId === 'string') {
			routeStore.setViewSite(props.ringId, siteId);
		}

	} catch (err) {
		console.error(err);
	} finally {
		creating.value = false;
	}

}

</script>
<template>
	<div class="flex flex-col gap-y-2">
		<div>{{ ringId }}: Add Site</div>

		<div class="flex flex-col gap-y-2 items-stretch">
			<input type="url" v-model="urlRef" placeholder="website url" required>
			<input type="text" v-model="titleRef" placeholder="website title">
			<input type="url" v-model="bannerRef" placeholder="website banner">

			<button type="button"
					@click="addSite"
					:disabled="creating">Submit</button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useRingStore } from '@/store/ring-store';
import { SiteData } from '@shared/webring';

const props = defineProps<{
	ringId: string,
	siteId: string,
}>();

const ringStore = useRingStore();

const site = computed(() => {
	return ringStore.getSite(props.ringId, props.siteId);
})

</script>
<template>
	<div class="flex flex-col">
		<div>
			<img v-if="site?.icon" :src="site.icon">
			<span>id:</span>
			<span>ringId / </span>
			<span>{{ siteId }}</span>
		</div>

		<div><a :href="site?.url">{{ site?.url ?? '' }}</a></div>
		<div>{{ site?.title || 'No title' }}</div>
		<div>{{ site?.banner || 'No banner' }}</div>
		<div>
			<span>Creator:</span>
			<span>{{ site?.creator || 'Unknown' }}</span>
		</div>

	</div>
</template>

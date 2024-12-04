<script lang="ts" setup>
import { SiteData } from '@shared/webring';

const props = defineProps<{
	site: SiteData
}>();


</script>
<template>
	<div class="flex flex-col">
		<div>
			<img v-if="site.icon" :src="site.icon">
			<span>id:</span><span>{{ site.id }}</span>
		</div>

		<div><a :href="site.url">{{ site.url }}</a></div>
		<div>{{ site.title || 'No title' }}</div>
		<div>{{ site.banner || 'No banner' }}</div>
		<div>
			<span>Creator:</span>
			<span>{{ site.creator || 'Unknown' }}</span>
		</div>

	</div>
</template>

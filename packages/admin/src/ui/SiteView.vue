<script lang="ts" setup>
import { SiteData } from '../../../types/webring';

const props = defineProps<{
	site: SiteData
}>();

</script>
<template>
	<div>
		<div><span>id:</span><span>{{ site.id }}</span></div>
		<div><a :href="site.url">{{ site.url }}</a></div>
		<div>{{ site.title || 'No title' }}</div>
		<div>{{ site.banner || 'No banner' }}</div>
		<div>
			<span>Creator:</span>
			<span>{{ site.creator || 'Unknown' }}</span>
		</div>
		<div>{{ site.icon }}</div>
	</div>
</template>

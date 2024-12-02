<script setup lang="ts">
import { WebringData } from '../../../shared/webring';
import SiteView from './SiteView.vue';

const props = defineProps<{
	ring: WebringData
}>();

</script>
<template>
	<div>
		<div v-for="site in ring.sites" :key="site.url">
			<SiteView :site="site" />
		</div>
	</div>
</template>
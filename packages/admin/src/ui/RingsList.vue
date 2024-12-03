<script setup lang="ts">
import { WebringData } from '@shared/webring';

const props = defineProps<{
	rings: WebringData[]
}>();

</script>
<template>
	<div v-for="ring in rings">
		{{ ring.sites }}
	</div>
</template>
<script setup lang="ts">

const ringId = ref<string>();

</script>
<template>
	<div>

		<input type="text" v-model="ringId">
		<button type="button">Create</button>
	</div>
</template>
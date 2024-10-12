<script setup lang="ts">

const curIndex = ref(0);

onMounted(() => {

	setTimeout(() => {

		curIndex.value = 2;
	}, 3000);

});


</script>
<template>
	<div>
		<div>Webring Test</div>
		<myth-ring url="temp" :index="curIndex">
		</myth-ring>
	</div>
</template>
<script setup lang="ts">

const curIndex = ref(0);
const myRing = ref<HTMLElement>();

onMounted(() => {

	setTimeout(() => {

	}, 3000);

});


</script>
<template>
	<div>
		<div>Webring Test</div>
		<!--<myth-ring ref="myRing" :index="curIndex">
		</myth-ring>-->
	</div>
</template>
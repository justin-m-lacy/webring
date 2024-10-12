<script setup lang="ts">

const curIndex = ref(0);
const myRing = ref<HTMLElement>();

onMounted(() => {

	setTimeout(() => {

		curIndex.value = 2;

		/*const anchor = document.createElement('a');
		anchor.slot = 'prevsite';
		anchor.textContent = '{{url}}';

		const anchor2 = document.createElement('a');
		anchor2.textContent = '{{url}}';
		anchor2.slot = 'nextsite';

		myRing.value?.appendChild(anchor);
		myRing.value?.appendChild(anchor2);*/

	}, 3000);

});


</script>
<template>
	<div>
		<div>Webring Test</div>
		<myth-ring ref="myRing" :index="curIndex">
		</myth-ring>
	</div>
</template>
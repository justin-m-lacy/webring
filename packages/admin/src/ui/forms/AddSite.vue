<script setup lang="ts">
import { ref } from 'vue';


const url = ref('');
const title = ref('');
const banner = ref('');

const addSite = () => {

}

</script>
<template>
	<div>

		<input type="url" v-model="url" placeholder="website url">
		<input type="text" v-model="title" placeholder="website title">
		<input type="url" v-model="banner" placeholder="website banner">

		<button type="button" @click="addSite">Submit</button>
	</div>
</template>
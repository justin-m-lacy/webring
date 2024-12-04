<script setup lang="ts" generic="T extends any">
import { positionAt } from './popups.js';


const props = withDefaults(defineProps<{

	title?: string,
	desc?: string,
	cancelText?: string,
	confirmText?: string,
	elm?: HTMLElement,
	item?: T

}>(), {

	confirmText: 'Confirm',
	cancelText: 'Cancel',

});

defineEmits<{
	(e: 'confirm', item: T): void;
	(e: 'cancel'): void;
}>();

const infoEl = shallowRef<HTMLElement | undefined>();

watch(() => props.elm, (focusElm) => {

	if (!focusElm) {
		console.log(`no focus elm`);
		return;
	}

	nextTick(() => {
		if (infoEl.value) {
			positionAt(infoEl.value, focusElm);
		}
	});

}, { immediate: true });


</script>
<template>
	<div ref="infoEl"
		 class="absolute min-w-24 p-2 px-3 pb-3 z-50 bg-slate-400
			 	transition-opacity auto-fade flex flex-col space-y-2 border border-gray-600">
		<div v-if="title">{{ title }}</div>
		<div v-if="desc">{{ desc }}</div>
		<div class="flex space-x-1">
			<button class=" btn border rounded-md border-gray-600 hover:bg-gray-800 disabled:opacity-50"
					@click="$emit('confirm', item as T)">

				{{ confirmText }}
			</button>
			<button class="btn rounded-md hover:bg-gray-800 hover:border border-gray-600"
					@click="$emit('cancel')">{{ cancelText }}</button>
		</div>
	</div>

</template>
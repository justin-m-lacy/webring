import { defineStore } from "pinia";
import { WebringData } from "../../../types/webring";

export const useRingStore = defineStore('ring', () => {

	const curRingId = ref<string>();

	const webrings = ref(new Map<string, WebringData>());

	const curRing = computed(() => {
		const id = curRingId.value;
		return id ? webrings.value.get(id) : null;
	});

	function setCur(id: string) {
		curRingId.value = id;
	}

	return {
		setCur,
		webrings,
		curRing
	}

});
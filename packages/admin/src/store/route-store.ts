import { defineStore } from "pinia";

export const useRouteStore = defineStore('route', () => {

	const curRoute = ref<'string'>();

	return {
		curRoute
	}

});
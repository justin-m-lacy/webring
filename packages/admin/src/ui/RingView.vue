<script setup lang="ts">
import { WebringData } from '@shared/webring';
import SiteView from './SiteView.vue';
import Confirm from './components/Confirm.vue';
import { useRingStore } from '@/store/ring-store';

const props = defineProps<{
	ringId: string
}>();

const ringStore = useRingStore();

const ring = computed(() => ringStore.getRing(props.ringId));

const emits = defineEmits<{
	(e: 'select', ring: string, site: string): void;
	(e: 'delete-site', ring: string, site: string): void;
}>();

const siteRefs = useTemplateRef('sites');
const deleteSite = ref<string | undefined>(undefined);
const deleteElm = ref<HTMLElement | undefined>(undefined);

// deleting in progress.
const deleting = ref(false);

function selectSite(siteId: string) {
	emits('select', props.ringId, siteId);
}

const clearDelete = () => {
	deleteSite.value = undefined;
	deleteElm.value = undefined;
}

const confirmDelete = async () => {

	try {

		deleting.value = true;

		const siteId = deleteSite.value;
		if (siteId == null) return;

		await ringStore.removeSite(props.ringId, siteId);

	} catch (err) {

	} finally {
		deleting.value = false;
		clearDelete();
	}

}
const tryDelete = (ind: number) => {

	deleteSite.value = props.ringId;
	deleteElm.value = siteRefs.value?.[ind];

}
</script>
<template>
	<div>
		<Confirm v-if="deleteSite" title="'Confirm Delete'"
				 confirm-text="Delete"
				 :elm="deleteElm"
				 @confirm="confirmDelete"
				 @cancel="clearDelete" />
		<div v-if="ring" v-for="(site, ind) in ring.sites" ref="sites" :key="site.url">
			<span @select="selectSite(site.id)">{{ site.id }}</span>
			<span><a :href="site.url">{{ site.url }}</a></span>
			<span @click="tryDelete(ind)">TRY DELETE</span>
		</div>
	</div>
</template>
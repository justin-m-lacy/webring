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
	(e: 'select', ringId: string, siteId: string): void;
	(e: 'add-site', ringId: string): void;

	//(e: 'delete-site', ring: string, site: string): void;
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

function addSite() {
	emits('add-site', props.ringId);
}

function tryDelete(ind: number) {

	const delSite = ring.value?.sites[ind];
	if (!delSite) return;
	deleteSite.value = delSite.id;
	deleteElm.value = siteRefs.value?.[ind]?.querySelector('.deleter') ?? undefined;

}
</script>
<template>
	<div class="flex flex-col pl-2 pt-1 space-y-2">
		<Confirm v-if="deleteSite" title="'Confirm Delete'"
				 confirm-text="Delete"
				 :elm="deleteElm"
				 @confirm="confirmDelete"
				 @cancel="clearDelete" />
		<button type="button" @click="addSite">Add Site</button>
		<div v-if="ring" v-for="(site, ind) in ring.sites"
			 ref="sites" :key="site.url"
			 class="flex space-x-2 cursor-pointer">
			<span @select="selectSite(site.id)">{{ site.id ?? site.title }}</span>
			<span>
				<a :href="site.url"
				   class="italic visited:bg-purple-900 text-blue-700">{{ site.url }}</a>
			</span>
			<span class="material-symbols-outlined deleter" @click="tryDelete(ind)">
				delete
			</span>
		</div>
	</div>
</template>
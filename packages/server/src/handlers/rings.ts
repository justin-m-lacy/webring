import { loadRingList } from '@/ring-io.js';
import { useRingStore } from '@/ring-store.js';
import Express from 'express';

const ringStore = useRingStore();

export const handleRings = (app: Express.Application) => {

	/**
	 * Get list of all webrings.
	 */
	app.get('/rings', async (req, res) => {

		console.log(`get ring list`);
		const list = await loadRingList();
		res.json({
			rings: list
		});

	});

	/**
	 * Create new Webring
	 */
	app.post('/rings', async (req, res) => {

		const ringId = req.body.ringid;
		console.log(`create ring: ${ringId}`);
		ringStore.createNew(ringId);

	});

}

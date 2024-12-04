import { loadRingList } from '@/io/ring-io.js';
import { useRingCache } from '@/ring-cache.js';
import Express from 'express';

const ringStore = useRingCache();

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
		ringStore.newRing(ringId);

	});

}

import { loadRingList } from '@/io/ring-io.js';
import { useRingCache } from '@/ring-cache.js';
import Express from 'express';

const ringStore = useRingCache();

export const handleRingList = (app: Express.Application) => {

	/**
	 * Get list of all webrings.
	 */
	app.get('/rings', async (req, res) => {

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

import { useRingCache } from '@/ring-cache.js';
import Express from 'express';

const ringStore = useRingCache();
export const handleWebring = (app: Express.Application) => {

	app.use('/rings/:ringid', async (req, res, next) => {

		const ringId = req.params.ringid;
		if (!ringId || typeof ringId !== 'string' || ringId.length > 100) {
			res.sendStatus(400);
			return;
		}

		const ring = await ringStore.getOrLoad(ringId);
		if (!ring) {
			res.sendStatus(404);
			return;
		}

		res.locals.ring = ring;
		next();

	});


	app.get('/rings/:ringid', async (req, res) => {
		res.send({
			ring: res.locals.ring
		});

	});

	app.delete('/rings/:ringid', async (req, res) => {

		console.log(`delete ring: ${req.params.ringid}`);
		await ringStore.deleteRing(req.params.ringid);

	});

}
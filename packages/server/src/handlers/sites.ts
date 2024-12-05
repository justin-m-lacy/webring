import { useRingCache } from '@/ring-cache.js';
import { SiteData, WebringData } from '@shared/webring.js';
import Express from 'express';

const ringCache = useRingCache();

export const handleSites = (app: Express.Application) => {

	app.use('/rings/:ringid/sites/:site', (req, res, next) => {
		const siteId = req.params.site;
		if (!siteId || typeof siteId !== 'string' || siteId.length > 100) {
			res.sendStatus(400);
			return;
		}

		const ring = res.locals.ring as WebringData;
		const site = ring.sites.find(s => s.id === siteId);
		if (!site) {
			res.sendStatus(404);
			return;
		}

		res.locals.site = site;
		next();

	});

	/**
	 * Post new site to ring.
	 */
	app.post('/rings/:ringid/sites/', (req, res) => {

		const site = req.body.site;
		if (!site || typeof site !== 'object') {
			res.sendStatus(400);
			return;
		}
		const ring = res.locals.ring as WebringData;

		const url = site.url;

		if (ring.sites.find(s => s.url === url)) {
			// conflict
			res.sendStatus(409);
			return;
		}
		const siteId = ringCache.addSite(ring.id, site);

		res.json({ siteid: siteId });

	});

	app.get('/rings/:ringid/sites/:site/', async (req, res) => {

		const ring = await ringCache.getOrLoad(req.params.ringid);

		if (ring) {

			const site = ring.sites.find(v => v.url === req.params.site);
			if (site) {
				res.send(site);
			} else {
				res.sendStatus(404);
			}

		} else {
			res.sendStatus(404);
		}
	});



	/*app.patch('/rings/:ringid/sites/:site/', (req, res) => {
	
	});*/

	app.delete('/rings/:ringid/sites/:site/', (req, res) => {

		const ring = res.locals.ring as WebringData;
		const site = res.locals.site as SiteData;

		console.log(`delete site: ${site.id}`);

		const ind = ring.sites.findIndex(s => s.id === site.id);
		if (ind < 0) {
			res.sendStatus(404);
			return;
		}

		ring.sites.splice(ind, 1);
		ringCache.saveRing(ring);

	});



}
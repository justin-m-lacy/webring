import express from 'express';
import { loadRingList } from './src/ring-io';
import { useRingStore } from "./src/ring-store";

const ringStore = useRingStore();

const app = express();
const port = 3000;

if (process.env.DEFAULT_RING) {
	ringStore.getOrLoad(process.env.DEFAULT_RING);
}

app.use(express.urlencoded());
app.use(express.json());

app.all('/rings/:ringid', (req, res, next) => {

	const ringId = req.params.ringid;
	if (!ringId || typeof ringId !== 'string' || ringId.length > 100) {
		res.sendStatus(400);
	} else {
		next();
	}

});

app.all('/rings/:ringid/sites/:site', (req, res, next) => {
	const siteId = req.params.site;
	if (!siteId || typeof siteId !== 'string' || siteId.length > 100) {
		res.sendStatus(400);
	} else {
		next();
	}
});

app.get('/rings', async (req, res) => {

	const list = await loadRingList();
	res.json({
		rings: list
	});

});

app.post('/rings', async (req, res) => {

	const ringId = req.body.ringid;
	ringStore.saveRing

});

app.get('/rings/:ringid', async (req, res) => {

	const ring = await ringStore.getOrLoad(req.params.ringid);
	if (ring) {
		res.send({
			ring: ring
		});
	} else {
		res.sendStatus(404);
	}

});


app.get('/rings/:ringid/sites/:site/', async (req, res) => {
	const ring = await ringStore.getOrLoad(req.params.ringid);
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

app.post('/rings/:ringid/sites/:site/', (req, res) => {

});

app.patch('/rings/:ringid/sites/:site/', (req, res) => {

});

app.listen(port, () => {
	console.log(`listening port: ${port}`);
});
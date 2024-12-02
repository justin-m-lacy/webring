import Express from "express";
import { loadRing } from "./src/ring-load";
import { WebringData } from "./src/webring";


const webringCache = new Map<string, WebringData>();

const app = Express();
const port = 3000;

if (process.env.DEFAULT_RING) {
	try {
		const webring = await loadRing(process.env.DEFAULT_RING);
		webringCache.set(process.env.DEFAULT_RING, webring);
	} catch (err) {
		console.error(err);
	}
}

app.get('/rings/:ringid/', (req, res) => {
	//req.params.id;
});


app.get('/rings/:ringid/sites/:site/', (req, res) => {
	//req.params.id;
});

app.post('/rings/:ringid/sites/:site/', (req, res) => {

});

app.patch('/rings/:ringid/sites/:site/', (req, res) => {

});

app.listen(port, () => {

});
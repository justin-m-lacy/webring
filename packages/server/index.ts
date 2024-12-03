import express from 'express';
import { handleRings } from './src/handlers/rings.js';
import { handleSites } from './src/handlers/sites';
import { handleWebring } from './src/handlers/webring.js';
import { useRingStore } from "./src/ring-store.js";

const ringStore = useRingStore();

const app = express();
const port = 3000;

if (process.env.DEFAULT_RING) {
	ringStore.getOrLoad(process.env.DEFAULT_RING);
}

app.use(express.urlencoded());
app.use(express.json());

handleRings(app);
handleWebring(app);
handleSites(app);


app.listen(port, () => {
	console.log(`listening port: ${port}`);
});
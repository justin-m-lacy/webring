import cors from 'cors';
import express from 'express';
import { handleRings } from './src/handlers/rings.js';
import { handleSites } from './src/handlers/sites';
import { handleWebring } from './src/handlers/webring.js';
import { useRingCache } from "./src/ring-cache.js";

const ringStore = useRingCache();

const app = express();
const port = 3000;

if (process.env.DEFAULT_RING) {
	ringStore.getOrLoad(process.env.DEFAULT_RING);
}


console.log(`allow access: ${process.env.WEB_HOST}`)
app.use(cors({
	origin: process.env.WEB_HOST,
	credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

handleRings(app);
handleWebring(app);
handleSites(app);


app.listen(port, () => {
	console.log(`listening port: ${port}`);
});
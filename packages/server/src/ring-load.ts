import { readFile, writeFile } from 'fs/promises';
import { WebringData } from './webring';

/// loads in progress to avoid duplicate loads.
const loads = new Map<string, Promise<Buffer>>();

export async function loadRing(ringId: string): Promise<WebringData> {

	const curLoad = loads.get(ringId) ?? readFile(`./rings/${ringId}.json`);
	loads.set(ringId, curLoad);

	const fileData = await curLoad;
	return JSON.parse(fileData.toString('utf8')) as WebringData;

}

export async function writeRing(ringId: string, data: WebringData): Promise<boolean> {

	try {
		await writeFile(`./rings/${ringId}.json`, JSON.stringify(data));
		return true;
	} catch (err) {
		return false;
	}

}
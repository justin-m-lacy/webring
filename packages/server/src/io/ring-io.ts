import { WebringData } from '@shared/webring.js';
import { readdirSync } from 'fs';
import { readdir, readFile, rm, writeFile } from 'fs/promises';
import { basename, extname } from 'path';

/// loads in progress to avoid duplicate loads.
const loads = new Map<string, Promise<Buffer>>();

export const getRingFile = (ringId: string) => `./rings/${ringId}.json`;

export async function loadRingList(): Promise<string[]> {

	const entries = await readdir('./rings', { withFileTypes: true });

	return entries.filter(
		f => f.isFile() && extname(f.name) === 'json'
	).map(f => basename(f.name, '.json'));

}

export function loadRingListSync(): string[] {

	const entries = readdirSync('./rings', { withFileTypes: true });

	return entries.filter(
		f => f.isFile() && extname(f.name) === 'json'
	).map(f => basename(f.name, '.json'));

}

export async function loadRing(ringId: string): Promise<WebringData> {

	const curLoad = loads.get(ringId) ?? readFile(`./rings/${ringId}.json`);
	loads.set(ringId, curLoad);

	const fileData = await curLoad;
	return JSON.parse(fileData.toString('utf8')) as WebringData;

}

export async function writeRing(ringId: string, data: WebringData): Promise<boolean> {

	try {
		await writeFile(getRingFile(ringId), JSON.stringify(data), {
			flag: 'r+'
		});
		return true;
	} catch (err) {
		return false;
	}

}

export async function createNewRing(ringId: string, data: WebringData) {

	await writeFile(getRingFile(ringId), JSON.stringify(data), {
		flag: 'wx'
	});

}

export async function deleteRingIo(ringId: string) {

	await rm(getRingFile(ringId));

}
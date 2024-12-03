import * as esbuild from 'esbuild';

esbuild.build({
	entryPoints: ['./index.ts'],
	platform: 'node',
	bundle: true,
	minify: true,
	outdir: './build'
})
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_RING_HOST: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
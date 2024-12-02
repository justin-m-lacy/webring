export type WebringData = {
	sites: SiteData[]
}

export type SiteData = {
	id: string,
	url: string,
	title?: string,
	icon?: string,
	creator?: string,
	banner?: string,
}

export type WebringData = {
	sites: SiteData[]
}

export type SiteData = {
	url: string,
	title?: string,
	icon?: string,
	creator?: string,
	banner?: string,
}

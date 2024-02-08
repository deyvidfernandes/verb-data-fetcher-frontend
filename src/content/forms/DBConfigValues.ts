export interface DBConfigValues {
	outputMethod: { persistData: boolean; outputJson: boolean }
	type: string
	url: string
	name: string
	table: string
	user: string
	password: string
	baseDataFile: File | null
}

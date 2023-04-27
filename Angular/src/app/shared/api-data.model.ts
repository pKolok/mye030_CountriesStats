export interface ApiData {
    status: string;
	country: string;
    statistic: string;
    results: number;
    data: { stat: number, year: number }[]
}
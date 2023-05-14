export interface ApiResponseData {
    status: string;
	country: string;
    statistic: string;
    results: number;
    data: { year: number, stat: number }[]
}

export interface OneStat {
    country: string;
    statistic: string;
    results: number;
    data: { year: number, stat: number }[]
}

export interface TwoStats {
    country1: string;
    country2: string;
    statistic1: string;
    statistic2: string;
    results: number;
    data: { year: number, stat1: number, stat2: number }[]
}
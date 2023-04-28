import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { zip  } from 'rxjs';

@Injectable({providedIn: "root"})
export class DBService {
    private url: string = "http://127.0.0.1:3000/api/v1";

    constructor(private http: HttpClient) {}

    getAllCountries(): string[] {
        const countries: string[] = [];
        this.http.get(this.url + "/countries").subscribe((data: any) => {
            for(let i = 0; i < data.data.countries.length; i++) {
                countries.push(data.data.countries[i].display_name);
            }
            console.log(data);
        });
        return countries;
    }

    getCountryStatistic(_country: string, _statistic: string): any {
        const url = this.url + "/demographics/" + _country + "/" + _statistic;
        return this.http.get(url);
    }

    getCountryStatistics(_country: string, _statistic1: string,
        _statistic2: string) {

        const url1 = this.url + "/demographics/" + _country + "/" + _statistic1;   
        const url2 = this.url + "/income/" + _country + "/" + _statistic2;   

        const stat1Data$ = this.http.get(url1);
        const stat2Data$ = this.http.get(url2);

        return zip(stat1Data$, stat2Data$);
    }

}
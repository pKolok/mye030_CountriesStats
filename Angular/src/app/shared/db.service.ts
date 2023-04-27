import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class DBService {
    url = "http://127.0.0.1:3000/api/v1";

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

}
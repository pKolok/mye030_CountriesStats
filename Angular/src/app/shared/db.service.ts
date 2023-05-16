import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, zip  } from 'rxjs';
import { ApiResponseData } from "./api-data.model";

@Injectable({providedIn: "root"})
export class DBService {
    private url: string = "http://127.0.0.1:3000/api/v1";

    constructor(private http: HttpClient) {}

    // TODO: make consistent with remaining?
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

    getYearsByCountryAndStatistic(_country: string, _statistic: string)
    : Observable<any> {
        const url = this.url + "/years/" + _country + "/" + _statistic;
        return this.http.get(url);
    }

    // TODO: - direct to demographics/income accordingly
    getCountryStatistic(_country: string, _statistic: string, _fromYear: number,
        _toYear: number): Observable<any> {
        const url = this.url + "/demographics/" + _country + "/" + _statistic 
            + "/" + _fromYear + "/" + _toYear;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    getCountryStatisticBySex(_country: string, _statistic: string, _sex: string)
    : Observable<any> {
        const url = this.url + "/demographics/" + _country + "/" + _statistic +
            "/" + _sex;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    getCountryStatisticByAgeGroup(_country: string, _statistic: string, 
        _startingAge: string): Observable<any> {
        const url = this.url + "/demographics/" + _country + "/" + _statistic +
            "/starting-age/" + _startingAge;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    private filterNull(data: { year: number, stat: number }[]): any {
        
        let filteredData: { year: number, stat: number }[] = [];

        for (let i = 0; i < data.length; ++i) {
            if (data[i].stat !== null) {
                filteredData.push(data[i]);
            }
        }
        return filteredData;
    }
}
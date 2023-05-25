import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map  } from 'rxjs';

import { ApiResponseData } from "./api-data.model";
import { Statistic } from "../home/choose-statistic/statistic.model";
import { 
    statsBySex, 
    statsBySexAndAge, 
    statsBySexAndAgeGroup, 
    statsByAgeGroup 
} from './statisticCategories';

@Injectable({providedIn: "root"})
export class DBService {
    private url: string = "http://127.0.0.1:3000/api/v1";

    constructor(private http: HttpClient) {}

    // TODO: make consistent with remaining?
    public getAllCountries(): string[] {
        const countries: string[] = [];
        this.http.get(this.url + "/countries").subscribe((data: any) => {
            for(let i = 0; i < data.data.countries.length; i++) {
                countries.push(data.data.countries[i].display_name);
            }
            console.log(data);
        });
        return countries;
    }

    public getAvailableYears(_statistic: Statistic): Observable<any> {    
        if (statsBySex.includes(_statistic.statistic)) {
            return this.getYearsBySex(_statistic);
        } else if (statsBySexAndAge.includes(_statistic.statistic)) {
            return this.getYearsBySexAndAge(_statistic);
        } else if (statsBySexAndAgeGroup.includes(_statistic.statistic)) {
            return this.getYearsBySexAndAgeGroup(_statistic);
        } else if (statsByAgeGroup.includes(_statistic.statistic)) {
            return this.getYearsByAgeGroup(_statistic);
        } else {
            return this.getYears(_statistic);
        }
    }
    
    public getStatistic(_statistic: Statistic): Observable<any> {
        if (statsBySex.includes(_statistic.statistic)) {
            return this.getStatisticBySex(_statistic);
        } else if (statsBySexAndAge.includes(_statistic.statistic)) {
            return this.getStatisticBySexAndAge(_statistic);
        } else if (statsBySexAndAgeGroup.includes(_statistic.statistic)) {
            return this.getStatisticBySexAndAgeGroup(_statistic);
        } else if (statsByAgeGroup.includes(_statistic.statistic)) {
            return this.getStatisticByAgeGroup(_statistic);
        } else {
            return this.getCountryStatistic(_statistic);
        }
    }

    private getYears(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;

        const url = this.url + "/years/" + country + "/" + statistic;
        return this.http.get(url);
    }

    private getYearsBySex(_statistic: Statistic): Observable<any> {        
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const sex: string = _statistic.sex;

        const url = this.url + "/years/" + country + "/" + statistic +
            "/" + sex;
        return this.http.get(url);
    }

    private getYearsByAgeGroup(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        var fertilityAgeGroup: string = _statistic.fertilityAgeGroup;
        fertilityAgeGroup = fertilityAgeGroup.replace("[", "")
            .replace("]", "").split(",")[0];

        const url = this.url + "/years/" + country + "/" + statistic +
            "/age-group/" + fertilityAgeGroup;
        return this.http.get(url);
    }

    private getYearsBySexAndAge(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const sex: string = _statistic.sex;
        const age: string = _statistic.age;

        const url = this.url + "/years/" + country + "/" + statistic +
            "/" + sex + "/age/" + age;
        return this.http.get(url);
    }

    private getYearsBySexAndAgeGroup(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const sex: string = _statistic.sex;
        var ageGroup: string = _statistic.ageGroup;

        if (ageGroup === "All Ages") {
            ageGroup = "all";
        } else {
            ageGroup = ageGroup.replace("[", "").replace("]", "").split("-")[0];
        }

        const url = this.url + "/years/" + country + "/" + statistic +
            "/" + sex +"/age-group/" + ageGroup;
        return this.http.get(url);
    }

    private getCountryStatistic(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const fromYear: number = _statistic.fromYear;
        const toYear: number = _statistic.toYear;

        const url = this.url + "/statistics/" + country + "/" + statistic 
            + "/" + fromYear + "/" + toYear;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    private getStatisticBySex(_statistic: Statistic): Observable<any> {        
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const fromYear: number = _statistic.fromYear;
        const toYear: number = _statistic.toYear;
        const sex: string = _statistic.sex;

        const url = this.url + "/statistics/" + country + "/" + statistic +
            "/" + fromYear + "/" + toYear + "/" + sex;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    private getStatisticByAgeGroup(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const fromYear: number = _statistic.fromYear;
        const toYear: number = _statistic.toYear;
        var fertilityAgeGroup: string = _statistic.fertilityAgeGroup;
        fertilityAgeGroup = fertilityAgeGroup.replace("[", "")
            .replace("]", "").split("-")[0];

        const url = this.url + "/statistics/" + country + "/" + statistic +
            "/" + fromYear + "/" + toYear + "/age-group/" + fertilityAgeGroup;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    private getStatisticBySexAndAge(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const fromYear: number = _statistic.fromYear;
        const toYear: number = _statistic.toYear;
        const sex: string = _statistic.sex;
        const age: string = _statistic.age;

        const url = this.url + "/statistics/" + country + "/" + statistic +
            "/" + fromYear + "/" + toYear + "/" + sex + "/age/" + age;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    private getStatisticBySexAndAgeGroup(_statistic: Statistic)
    : Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const fromYear: number = _statistic.fromYear;
        const toYear: number = _statistic.toYear;
        const sex: string = _statistic.sex;
        var ageGroup: string = _statistic.ageGroup;

        if (ageGroup === "All Ages") {
            ageGroup = "all";
        } else {
            ageGroup = ageGroup.replace("[", "").replace("]", "").split("-")[0];
        }

        const url = this.url + "/statistics/" + country + "/" + statistic +
            "/" + fromYear + "/" + toYear + "/" + sex +"/age-group/" + ageGroup;
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
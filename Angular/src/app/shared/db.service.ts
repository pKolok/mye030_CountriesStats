import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, zip  } from 'rxjs';
import { ApiResponseData } from "./api-data.model";
import { Statistic } from "../home/choose-statistic/statistic.model";

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

        const modifiedStatistic: Statistic = this.transformStatistic(_statistic);
        const country: string = modifiedStatistic.country;
        const statistic: string = modifiedStatistic.statistic;

        const url = this.url + "/years/" + country + "/" + statistic;
        return this.http.get(url);
    }

    getStatistic(_statistic: Statistic): Observable<any> {

        const modifiedStatistic: Statistic = this.transformStatistic(_statistic);

        if (modifiedStatistic.age) {
            // Case: Mid-Year Population by specific age
            return this.getStatisticBySex(modifiedStatistic);
        } else if (modifiedStatistic.ageGroup) {
            // Case: Mid-Year Population by Age Group
            return this.getStatisticByAgeGroup(modifiedStatistic);                
        } else {
            return this.getCountryStatistic(modifiedStatistic);
        }
    }

    // TODO: - direct to demographics/income accordingly & rename method
        private getCountryStatistic(_statistic: Statistic): Observable<any> {  
        const country: string = _statistic.country;
        const statistic: string = _statistic.statistic;
        const fromYear: number = _statistic.fromYear;
        const toYear: number = _statistic.toYear;

        const url = this.url + "/demographics/" + country + "/" + statistic 
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

        const url = this.url + "/demographics/" + country + "/" + statistic +
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
        const ageGroup: string = _statistic.ageGroup;

        const url = this.url + "/demographics/" + country + "/" + statistic +
            "/" + fromYear + "/" + toYear + "/starting-age/" + ageGroup;
        return this.http.get(url).pipe(
            map((response: ApiResponseData) => {
                response.data = this.filterNull(response.data);
                response.results = response.data.length;
                return response;
            })
        );
    }

    private transformStatistic(_statistic: Statistic): Statistic {
        var newStatistic: Statistic = _statistic.clone();
        
        if (newStatistic.age) {
            // Case: Mid-Year Population by specific age
            newStatistic.statistic = newStatistic.statistic.replace(
                " (by Age)", " at Age " + newStatistic.age);
            return newStatistic;
        } else if (newStatistic.ageGroup) {
            // Case: Mid-Year Population by Age Group
            newStatistic.statistic = newStatistic.statistic.replace(
                " (by Age Group)", " (" + newStatistic.sex + ")");
            if (newStatistic.ageGroup === "All Ages") {
                newStatistic.ageGroup = "all";
            } else {
                // Replace with starting age
                newStatistic.ageGroup = newStatistic.ageGroup.replace("[", "")
                    .replace("]", "").split(",")[0];
            }
            return newStatistic;           
        } else {
            if (newStatistic.sex) {
                newStatistic.statistic += " (" + newStatistic.sex + ")";
            }
            if (newStatistic.fertilityAgeGroup) {
                newStatistic.statistic += " " + newStatistic.fertilityAgeGroup;
            }
            return newStatistic;
        }
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
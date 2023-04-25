import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class DBService {

    constructor(private http: HttpClient) {}

    getAllCountries(): string[] {
        const countries: string[] = [];
        this.http.get("http://127.0.0.1:3000/api/v1/countries").subscribe(
            (data: any) => {
                for(let i = 0; i < data.data.countries.length; i++) {
                    countries.push(data.data.countries[i].Name);
                }
                console.log(data);
            }
        );
        return countries;
    }

}
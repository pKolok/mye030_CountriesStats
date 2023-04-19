import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: String = 'Angular';
  items: String[] = [];

  constructor(private http: HttpClient) {}

  onCities() {
    this.items = [];
    this.http.get('http://127.0.0.1:3000/api/v1/cities').subscribe(
      (data: any) => {
        for(let i = 0; i < data.data.cities.length; i++) {
          this.items.push(data.data.cities[i].Name);
        }
        console.log(data);
      }
    );
  }

  onCountries() {
    this.items = [];
    this.http.get('http://127.0.0.1:3000/api/v1/countries').subscribe(
      (data: any) => {
        for(let i = 0; i < data.data.countries.length; i++) {
          this.items.push(data.data.countries[i].Name);
        }
        console.log(data);
      }
    );
  }

  onLanguages() {
    this.items = [];
    this.http.get('http://127.0.0.1:3000/api/v1/countryLanguages').subscribe(
      (data: any) => {
        for(let i = 0; i < data.data.languages.length; i++) {
          this.items.push(data.data.languages[i].Language);
        }
        console.log(data);
      }
    );
  }
    
}

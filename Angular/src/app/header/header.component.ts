import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  // styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public collapsed = true;

  constructor(private router: Router) {}

  onOverAndOut(): void {
    this.router.navigate(["./welcome"]);
  }
}

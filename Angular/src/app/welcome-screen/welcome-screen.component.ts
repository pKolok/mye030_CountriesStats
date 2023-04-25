import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-welcome-screen",
    templateUrl: "./welcome-screen.component.html",
    styleUrls: ["./welcome-screen.component.css"]
})
export class WelcomeScreenComponent {

    // TODO Save background image in a server and load it from there

    constructor(private router: Router, private route: ActivatedRoute) {}

    onEmerge(): void {
        this.router.navigate(["./home/timelines"]);
    }

}
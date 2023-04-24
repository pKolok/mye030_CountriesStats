import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { HeaderComponent } from "../header/header.component";
import { HomeRoutingModule } from "./home-routing.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        HomeComponent,
        HeaderComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule
    ]
})
export class HomeModule {}
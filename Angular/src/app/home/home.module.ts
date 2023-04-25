import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { HeaderComponent } from "../header/header.component";
import { HomeRoutingModule } from "./home-routing.module";
import { CommonModule } from "@angular/common";
import { TimelinesComponent } from './timelines/timelines.component';
import { BarChartsComponent } from './bar-charts/bar-charts.component';
import { ScatterPlotsComponent } from './scatter-plots/scatter-plots.component';

@NgModule({
    declarations: [
        HomeComponent,
        HeaderComponent,
        TimelinesComponent,
        BarChartsComponent,
        ScatterPlotsComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule
    ]
})
export class HomeModule {}
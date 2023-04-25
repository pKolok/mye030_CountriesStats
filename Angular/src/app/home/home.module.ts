import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { HeaderComponent } from "../header/header.component";
import { HomeRoutingModule } from "./home-routing.module";
import { CommonModule } from "@angular/common";
import { TimelinesComponent } from "./timelines/timelines.component";
import { BarChartsComponent } from "./bar-charts/bar-charts.component";
import { ScatterPlotsComponent } from "./scatter-plots/scatter-plots.component";
import { ReactiveFormsModule } from "@angular/forms";
import { LineChartComponent } from "./timelines/line-chart/line-chart.component";
import { LineChart2Component } from "./timelines/line-chart2/line-chart2.component";

@NgModule({
    declarations: [
        HomeComponent,
        HeaderComponent,
        TimelinesComponent,
        BarChartsComponent,
        ScatterPlotsComponent,
        LineChartComponent,
        LineChart2Component
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ReactiveFormsModule
    ]
})
export class HomeModule {}
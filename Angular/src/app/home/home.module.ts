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
import { ScatterPlotComponent } from './scatter-plots/scatter-plot/scatter-plot.component';
import { ChooseStatisticComponent } from "./choose-statistic/choose-statistic.component";

@NgModule({
    declarations: [
        HomeComponent,
        HeaderComponent,
        TimelinesComponent,
        BarChartsComponent,
        ScatterPlotsComponent,
        LineChartComponent,
        ScatterPlotComponent,
        ChooseStatisticComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ReactiveFormsModule
    ]
})
export class HomeModule {}
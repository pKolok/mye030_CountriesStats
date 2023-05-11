import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "../header/header.component";
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import { ChooseStatisticComponent } from "./choose-statistic/choose-statistic.component";
import { LineChartsPageComponent } from "./line-charts-page/line-charts-page.component";
import { LineChartComponent } from "./line-charts-page/line-chart/line-chart.component";
import { BarChartsPageComponent } from "./bar-charts-page/bar-charts-page.component";
import { BarChartComponent } from './bar-charts-page/bar-chart/bar-chart.component';
import { ScatterPlotsPageComponent } from "./scatter-plots-page/scatter-plots-page.component";
import { ScatterPlotComponent } from './scatter-plots-page/scatter-plot/scatter-plot.component';

@NgModule({
    declarations: [
        HomeComponent,
        HeaderComponent,
        LineChartsPageComponent,
        BarChartsPageComponent,
        ScatterPlotsPageComponent,
        LineChartComponent,
        ScatterPlotComponent,
        ChooseStatisticComponent,
        BarChartComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ReactiveFormsModule
    ]
})
export class HomeModule {}
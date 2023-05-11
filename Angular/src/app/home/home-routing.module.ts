import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { LineChartsPageComponent } from "./line-charts-page/line-charts-page.component";
import { BarChartsPageComponent } from "./bar-charts-page/bar-charts-page.component";
import { ScatterPlotsPageComponent } from "./scatter-plots-page/scatter-plots-page.component";

const routes: Routes = [
    { path: "", component: HomeComponent, children: [
        { path: "timelines", component: LineChartsPageComponent },
        { path: "bar-charts", component: BarChartsPageComponent },
        { path: "scatter-plots", component: ScatterPlotsPageComponent}
    ] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
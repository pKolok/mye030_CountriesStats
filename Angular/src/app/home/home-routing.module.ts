import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { TimelinesComponent } from "./timelines/timelines.component";
import { BarChartsComponent } from "./bar-charts/bar-charts.component";
import { ScatterPlotsComponent } from "./scatter-plots/scatter-plots.component";

const routes: Routes = [
    { path: "", component: HomeComponent, children: [
        { path: "timelines", component: TimelinesComponent },
        { path: "bar-charts", component: BarChartsComponent },
        { path: "scatter-plots", component: ScatterPlotsComponent}
    ] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
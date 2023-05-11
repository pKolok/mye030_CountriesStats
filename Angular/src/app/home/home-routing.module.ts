import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { TimelinesComponent } from "./timelines/timelines.component";
import { BarChartsPageComponent } from "./bar-charts-page/bar-charts-page.component";
import { ScatterPlotsComponent } from "./scatter-plots/scatter-plots.component";

const routes: Routes = [
    { path: "", component: HomeComponent, children: [
        { path: "timelines", component: TimelinesComponent },
        { path: "bar-charts", component: BarChartsPageComponent },
        { path: "scatter-plots", component: ScatterPlotsComponent}
    ] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
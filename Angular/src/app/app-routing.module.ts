import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { WelcomeScreenComponent } from "./welcome-screen/welcome-screen.component";

// e.g. localhost:4200/users
// ** Wildcard route. Catches all unknown routes. Must be last in list
const appRoutes: Routes = [
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "welcome", component: WelcomeScreenComponent },
  { path: "home", loadChildren: () => import(
    "./home/home.module").then(m => m.HomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, 
    { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule] // To make RouterModule available externally
})

export class AppRoutingModule {}
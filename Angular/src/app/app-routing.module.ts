import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

// e.g. localhost:4200/users
// ** Wildcard route. Catches all unknown routes. Must be last in list
const appRoutes: Routes = [
    { path: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule] // To make RouterModule available externally
})

export class AppRoutingModule {}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./views/home/home.component";
import { NotFoundComponent } from "./views/not-found/not-found.component";
import { ProductsComponent } from "./views/products/products.component";
import { AboutUsComponent } from "./views/about-us/about-us.component";
import { CartComponent } from "./user/cart/cart.component";
import { PublishComponent } from "./user/publish/publish.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "products",
    component: ProductsComponent,
  },
  {
    path: "about-us",
    component: AboutUsComponent,
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "publish",
    component: PublishComponent,
  },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

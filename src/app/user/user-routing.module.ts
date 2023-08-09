import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { CartComponent } from "../user/cart/cart.component";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ConfirmComponent } from "./confirm/confirm.component";
import { SuccessComponent } from "./success/success.component";
import { WishlistComponent } from "./wish-list/wish-list.component";
import { BankAccountComponent } from "./bank-account/bank-account.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "cart",
    component: CartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "confirm",
    component: ConfirmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "order-success",
    component: SuccessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "wishlist",
    component: WishlistComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bank-account",
    component: BankAccountComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}

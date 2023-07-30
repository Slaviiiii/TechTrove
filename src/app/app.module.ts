import { NgModule, Provider } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { HomeComponent } from "./views/home/home.component";
import { NotFoundComponent } from "./views/not-found/not-found.component";
import { UserModule } from "./user/user.module";
import { ProductsComponent } from "./views/products/products.component";
import { AboutUsComponent } from "./views/about-us/about-us.component";
import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { AuthGuard } from "./auth/guards/auth.guard";
import { DetailsComponent } from "./views/details/details.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ProductsComponent,
    AboutUsComponent,
    DetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    UserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [INTERCEPTOR_PROVIDER, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}

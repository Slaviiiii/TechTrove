import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    NavigationComponent,
    GlobalLoaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [GlobalLoaderComponent]
})
export class CoreModule { }

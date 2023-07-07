import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CompletedPopupComponent } from './completed-popup/completed-popup.component'



@NgModule({
  declarations: [
    SpinnerComponent,
    CompletedPopupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SpinnerComponent, CompletedPopupComponent]
})
export class SharedModule {}

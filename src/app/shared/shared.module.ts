import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CompletedPopupComponent } from './completed-popup/completed-popup.component';
import { NotCompletedPopupComponent } from './not-completed-popup/not-completed-popup.component'



@NgModule({
  declarations: [
    SpinnerComponent,
    CompletedPopupComponent,
    NotCompletedPopupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SpinnerComponent, CompletedPopupComponent, NotCompletedPopupComponent]
})
export class SharedModule {}

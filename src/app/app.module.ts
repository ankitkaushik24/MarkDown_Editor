import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CcMarkDownDirective } from './mark-down-directive/cc-mark-down.directive';
import { PreviewPaneComponent } from './preview-pane/preview-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    CcMarkDownDirective,
    PreviewPaneComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SettingsComponent },
    ])
  ]
})
export class SettingsModule { }

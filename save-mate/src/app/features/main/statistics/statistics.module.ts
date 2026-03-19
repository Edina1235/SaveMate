import { NgModule } from '@angular/core';
import { StatisticsComponent } from './statistics.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from 'src/app/shared/shared.module';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';



@NgModule({
  declarations: [
    StatisticsComponent,
    InfoDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
        { path: '', component: StatisticsComponent },
    ])
]
})
export class StatisticsModule { }

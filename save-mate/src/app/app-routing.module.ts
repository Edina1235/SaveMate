import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeModule } from './features/main/home/home.module';
import { ContactModule } from 'src/app/features/main/contact/contact.module';
import { KnowledgeBaseModule } from 'src/app/features/main/knowledge-base/knowledge-base.module';
import { NotificationsModule } from 'src/app/features/main/notifications/notifications.module';
import { ProfilModule } from 'src/app/features/main/profil/profil.module';
import { SettingsModule } from 'src/app/features/main/settings/settings.module';
import { StatisticsModule } from './features/main/statistics/statistics.module';
import { LoginComponent } from './features/public/login/login.component';
import { SignUpComponent } from './features/public/sign-up/sign-up.component';
import { MainComponent } from './features/main/main.component';
import { QuestionsModule } from 'src/app/features/main/questions/questions.module';

const routes: Routes = [
  {path: '', component: MainComponent, canActivate: [AuthGuard], children: [
    {path: '', loadChildren: () => import('src/app/features/main/home/home.module').then(m => HomeModule)},
    {path: 'contact', loadChildren: () => import('src/app/features/main/contact/contact.module').then(m => ContactModule)},
    {path: 'knowledge-base', loadChildren: () => import('src/app/features/main/knowledge-base/knowledge-base.module').then(m => KnowledgeBaseModule)},
    {path: 'notifications', loadChildren: () => import('src/app/features/main/notifications/notifications.module').then(m => NotificationsModule)},
    {path: 'profil', loadChildren: () => import('src/app/features/main/profil/profil.module').then(m => ProfilModule)},
    {path: 'settings', loadChildren: () => import('src/app/features/main/settings/settings.module').then(m => SettingsModule)},
    {path: 'statistics', loadChildren: () => import('src/app/features/main/statistics/statistics.module').then(m => StatisticsModule)},
    {path: 'questions', loadChildren: () => import('src/app/features/main/questions/questions.module').then(m => QuestionsModule)},
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: '**', redirectTo: 'login'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

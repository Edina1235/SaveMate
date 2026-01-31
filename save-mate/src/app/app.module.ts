import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicComponent } from './features/public/public.component';
import { MainComponent } from './features/main/main.component';
import { HeaderComponent } from './core/components/header/header.component';
import { PiggySenseChatComponent } from './core/components/piggy-sense-chat/piggy-sense-chat.component';
import { HeaderSubMenuComponent } from './core/components/header/components/header-sub-menu/header-sub-menu.component';
import { ChatComponent } from './core/components/piggy-sense-chat/components/chat/chat.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './features/public/login/login.component';
import { SignUpComponent } from './features/public/sign-up/sign-up.component';
import { SpendingCategoriesComponent } from './shared/components/spending-categories/spending-categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './core/components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    PublicComponent,
    MainComponent,
    HeaderComponent,
    PiggySenseChatComponent,
    HeaderSubMenuComponent,
    ChatComponent,
    LoginComponent,
    SignUpComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

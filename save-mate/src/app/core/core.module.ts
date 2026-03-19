import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PiggySenseChatComponent } from './components/piggy-sense-chat/piggy-sense-chat.component';
import { HeaderSubMenuComponent } from './components/header/components/header-sub-menu/header-sub-menu.component';
import { ChatComponent } from './components/piggy-sense-chat/components/chat/chat.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PiggySenseChatComponent,
    HeaderSubMenuComponent,
    ChatComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PiggySenseChatComponent,
    HeaderSubMenuComponent,
    ChatComponent
  ]
})
export class CoreModule { }

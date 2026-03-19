import { Component } from '@angular/core';
import { AvatarImageName } from 'src/app/core/enums/avatar-image-name.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public avatarImgs: AvatarImageName[] = Object.values(AvatarImageName);
  public firstName: string = 'Edina';
  public lastName: string = 'Tóth';
  public activeAvatar: AvatarImageName | 'monogram' = 'monogram';

  public onClickAvatar(avatar: AvatarImageName) {
    this.activeAvatar = avatar;
  }

  public onClickMonogram() {
    this.activeAvatar = 'monogram';
  }

  public onClickSave() {}
}

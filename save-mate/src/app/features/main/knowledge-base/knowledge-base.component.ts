import { Component, HostListener, OnInit } from '@angular/core';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss']
})
export class KnowledgeBaseComponent implements OnInit {
  public titles: string[] = [
    "Cím 1",
    "Cím 2",
    "Cím 3",
    "Cím 4",
    "Cím 5",
  ];
  public activeTitle: string = '';
  public screen: 'mobile' | 'desktop' = 'desktop';

  public articles: KnowledgeBase[] = [
    {
      id: '1',
      title: 'Cím 1',
      text: 'Valami 1 edhjkd eidjiedjweio edwjodijjdfwfk edfjw ewkjrdwelk dwsdjqwid wjdqOJL JQWDHQOIU WQUEHUqihns jwqdhjcdnd cerufhdjnc b xuefhujcnd vherfgredf cjhfreuofcn cjkhfsdrefv m betigvn dkvnfkdc nbfrjdn nbvrujvnh urfhjc nufhcdnn vjnduoxnv nd c njowen njen cd dnvj  jc nd jewfnkdc nndwn sncnbcdjs cnf e csymnjsc ndmv kjvn dnm bjk dcnmds vmjfkd vnjmdf n',
      updateDate: new Date(),
      resourceLink: 'valami.com'
    },
    {
      id: '2',
      title: 'Cím 2',
      text: 'Valami 2',
      updateDate: new Date(),
      resourceLink: 'valami.com'
    },
    {
      id: '3',
      title: 'Cím 3',
      text: 'Valami 3',
      updateDate: new Date(),
      resourceLink: 'valami.com'
    },
    {
      id: '4',
      title: 'Cím 4',
      text: 'Valami 4',
      updateDate: new Date(),
      resourceLink: 'valami.com'
    },
    {
      id: '5',
      title: 'Cím 5',
      text: 'Valami 5',
      updateDate: new Date(),
      resourceLink: 'valami.com'
    },
  ];

  @HostListener('window:resize')
  onResize() {
    if(window.innerWidth <= 660) {
      this.screen = 'mobile';
    } else {
      this.screen = 'desktop';
      this.activeTitle = this.titles[0];
    }
  }

  ngOnInit(): void {
      this.onResize();
  }

  public onClickTitle(title: string) {
    this.activeTitle = title;
  }

  public onClickBack() {
    this.activeTitle = '';
  }
}

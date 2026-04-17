import { Component, HostListener, OnInit } from '@angular/core';
import { KnowledgeBase } from 'src/app/core/models/knowledge-base';
import { KnowledgeBaseService } from 'src/app/core/services/knowledge-base.service';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss']
})
export class KnowledgeBaseComponent implements OnInit {
  public activeTitle: string = '';
  public screen: 'mobile' | 'desktop' = 'desktop';

  public articles: KnowledgeBase[] = [];

  constructor(private knowledgeBaseService: KnowledgeBaseService) {}

  @HostListener('window:resize')
  onResize() {
    if(window.innerWidth <= 660) {
      this.screen = 'mobile';
    } else {
      this.screen = 'desktop';
    }
  }

  ngOnInit(): void {
    this.onResize();
    this.knowledgeBaseService.getKnowledgeBases().subscribe({next: knowledgeBases => {
      if(knowledgeBases) {
        this.articles = knowledgeBases as KnowledgeBase[];
        if(this.articles.length !== 0 && this.articles[0])
          this.activeTitle = this.articles[0].title;
      }
    }, error: error => console.error(error)});
  }

  public scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public onClickTitle(article: KnowledgeBase) {
    if(article !== undefined) {
      this.activeTitle = article.title;
      this.scrollTo(article.id);
    }
  }

  public onClickBack() {
    this.activeTitle = '';
  }
}

import {Component, Input, inject, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StrapiService } from '../../../strapi.service';
import { BlogTileComponent } from '../../../blog/blog-tile/blog-tile.component';
import { BlogArticle } from '../../../blog/blog.component';
import { StrapiQueryBuilder } from '../../../StrapiQueryBuilder';

export type ArticleBlogCardsSection = {
  __component: 'article-section.news-cards';
  background?: "nein" | "grün" | "beige";
  amount: number,
  type: string,
};


@Component({
  selector: 'app-blog-cards',
  standalone: true,
  imports: [BlogTileComponent, AsyncPipe],
  templateUrl: './blog-cards.component.html',
  styleUrl: './blog-cards.component.scss'
})
export class BlogCardsComponent implements OnInit {
  @Input({required: true}) sectionData!: ArticleBlogCardsSection;

  blogs$?: Observable<BlogArticle[]>;

  strapiSv = inject(StrapiService);

  ngOnInit() {
    this.blogs$ = this.strapiSv.get<BlogArticle[]>(
      new StrapiQueryBuilder<BlogArticle>("blogs")
        .sort(["publishedAt", "desc"])
        .populate("thumbnail")
        .pagination(this.sectionData.amount)
        .buildUrl()
    );
  }

}

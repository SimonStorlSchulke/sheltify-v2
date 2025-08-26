import { Component, inject } from '@angular/core';
import { ArticleSection, ArticleComponent } from '../article/article.component';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { AnimalArticleService } from '../animal-article.service';
import { StrapiMedia } from '../../types/types';

export type BlogArticle = {
  id: number,
  title: string,
  type: string,
  thumbnail?: StrapiMedia,
  description: string,
  artikel: ArticleSection[], //todo rename in strapi
  publishedAt: string,
  showAsPopup?: boolean,
}


export const blogArticleResolver: ResolveFn<BlogArticle>  = (
  route: ActivatedRouteSnapshot,
) => {
  const id = route.paramMap.get('id')!;  //todo null savety
  return inject(AnimalArticleService).getBlogArticle(+id);
}


@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ArticleComponent, RouterLink, DatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {

  article?: BlogArticle;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ articleData }) => {
      console.log(articleData)
        this.article = articleData;
      }
    );
  }
}

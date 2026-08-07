import { Component, effect, inject, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SectionRendererComponent } from '@app/section-renderer/section-renderer.component';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { lastValueFrom } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/dist/article-types';
import { CmsAnimal } from 'sheltify-lib/dist/cms-types';

@Component({
  selector: 'app-export-pdf',
  imports: [
    SectionRendererComponent
  ],
  templateUrl: './export-pdf.component.html',
  styleUrl: './export-pdf.component.scss',
})
export class ExportPdfComponent {

  private activatedRoute = inject(ActivatedRoute);
  animal = signal<CmsAnimal | null>(null);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private cmsRequestService = inject(CmsRequestService);
  private renderer = inject(Renderer2);

  article = signal<CmsArticle | undefined>(undefined);

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed())
      .subscribe(({animal}) => this.animal.set(animal));

    this.tenantConfigurationService.loadTenantStyle(this.renderer);

    effect(async () => {
      const articleId = this.animal()?.ArticleID;
      if (!articleId || articleId == '') {
        return;
      }
      this.article.set(await lastValueFrom(this.cmsRequestService.getArticle(articleId)));
    });
  }
}

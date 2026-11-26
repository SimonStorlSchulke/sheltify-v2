import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { createNewAnimal, createNewBlog } from '@app/cms-types/cms-type.factory';
import { TextInputModalComponent } from '@app/forms/text-input-modal/text-input-modal.component';
import { AnimalService } from '@app/services/animal.service';
import { BlogService } from '@app/services/blog.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-quick-actions',
  imports: [RouterLink, BtIconComponent],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionsComponent {
  private cmsRequestService = inject(CmsRequestService);
  private modalService = inject(ModalService);
  private animalService = inject(AnimalService);
  private blogService = inject(BlogService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private router = inject(Router);

  siteUrl = computed(() => this.tenantConfigurationService.config()?.SiteUrl || undefined);

  async newAnimal() {
    const name = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Name eingeben'});
    if (!name) return;

    const animal = createNewAnimal(name, await this.tenantConfigurationService.useDefaultAnimalKind());
    const saved = await firstValueFrom(this.cmsRequestService.saveAnimal(animal));
    await this.animalService.reloadAnimals();
    await this.router.navigate(['tiere', saved.ID]);
  }

  async newBlog() {
    const title = await this.modalService.openFinishable(TextInputModalComponent, {label: 'Blogtitel eingeben'});
    if (!title) return;

    const blog = createNewBlog();
    blog.Title = title;
    const saved = await firstValueFrom(this.cmsRequestService.saveBlogEntry(blog));
    this.blogService.reloadBlogs();
    await this.router.navigate(['blog', saved.ID]);
  }
}

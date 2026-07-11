import { Component, inject, model, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { TextInputComponent } from '@app/forms/text-input/text-input.component';
import { AlertService } from '@app/services/alert.service';
import { AuthService } from '@app/services/auth.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';

@Component({
  selector: 'app-tenant-configuration',
  imports: [
    FormsModule,
    TextInputComponent,
    ImagePickerSingleComponent,
    CheckboxInputComponent
  ],
  templateUrl: './tenant-configuration.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tenant-configuration.component.scss',
})
export class TenantConfigurationComponent implements OnInit {
  private cmsRequestService = inject(CmsRequestService);
  private tenantConfigurationService = inject(TenantConfigurationService);
  private readonly alertService = inject(AlertService);


  options = model<CmsTenantConfiguration | undefined>(undefined);
  isAdmin = inject(AuthService).isAdmin();

  async ngOnInit() {
    try {
      const options = await firstValueFrom(this.cmsRequestService.getTenantConfiguration());
      console.log("options", options);
      this.options.set(options);
    } catch (error) {
      console.log('did not find tenant configuration, creating default');
      this.options.set({
        ID: '',
        Name: '',
        SiteUrl: '',
        Address: '',
        ArticleCss: '',
        CmsShowAnimalKindSelector: true,
        DefaultAnimalKind: '',
        Email: '',
        IBAN: '',
        LinkFacebook: '',
        LinkInstagram: '',
        LinkPaypal: '',
        LinkTiktok: '',
        LinkYoutube: '',
        PhoneNumber: '',
        AnimalKinds: '',
        AnimalStati: '',
        BlogCategories: '',
        AnimalFeatureWhere: true,
        AnimalFeaturePatrons: true,
        AnimalFeatureRace: true,
        AnimalFeatureNoAdoption: true,
        AnimalShowUpdatesForDays: 1,
        NeedsRebuild: true,
      });
    }
  }

  async save() {
    await firstValueFrom(this.cmsRequestService.saveTenantConfiguration(this.options()!));
    this.tenantConfigurationService.reloadConfig();
  }
}

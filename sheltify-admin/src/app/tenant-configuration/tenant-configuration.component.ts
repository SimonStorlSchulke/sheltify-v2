import { Component, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { TextInputComponent } from 'src/app/forms/text-input/text-input.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';

@Component({
  selector: 'app-tenant-configuration',
  imports: [
    FormsModule,
    TextInputComponent,
    ImagePickerSingleComponent,
    CheckboxInputComponent
  ],
  templateUrl: './tenant-configuration.component.html',
  styleUrl: './tenant-configuration.component.scss',
})
export class TenantConfigurationComponent implements OnInit {

  public options = model<CmsTenantConfiguration | undefined>(undefined);


  constructor(
    private cmsRequestService: CmsRequestService,
    private tenantConfigurationService: TenantConfigurationService,
  ) {
  }

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
        BlogCategories: '',
        AnimalFeatureWhere: true,
        AnimalFeaturePatrons: true,
        AnimalFeatureRace: true,
        AnimalFeatureAnimalKind: true,
        AnimalFeatureNoAdoption: true,
        NeedsRebuild: true,
      });
    }
  }

  public async save() {
    await firstValueFrom(this.cmsRequestService.saveTenantConfiguration(this.options()!));
    this.tenantConfigurationService.reloadConfig();
  }
}

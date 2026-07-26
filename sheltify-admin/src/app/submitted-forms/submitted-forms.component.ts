import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { distinctUntilChanged, filter, firstValueFrom, map, switchMap, timer } from 'rxjs';
import { CmsFormSubmission } from 'sheltify-lib/cms-types';
import { LeftSidebarLayoutComponent } from '../layout/left-sidebar-layout/left-sidebar-layout.component';
import { AlertService } from '../services/alert.service';
import { CmsRequestService } from '../services/cms-request.service';

export const formResolver: ResolveFn<CmsFormSubmission> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  return inject(CmsRequestService).getSubmittedForm(id);
}

@Component({
  selector: 'app-submitted-forms',
  imports: [LeftSidebarLayoutComponent, DatePipe],
  templateUrl: './submitted-forms.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './submitted-forms.component.scss',
})
export class SubmittedFormsComponent {
  private authService = inject(AuthService);
  private cmsRequestService = inject(CmsRequestService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);

  animals = signal<CmsFormSubmission[]>([]);
  forms = signal<CmsFormSubmission[]>([]);
  selectedForm = signal<CmsFormSubmission | undefined>(undefined);

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed())
      .subscribe(({form}) => this.selectedForm.set(form));

    toObservable(this.selectedForm).pipe(
      filter((form): form is CmsFormSubmission => !!form),
      distinctUntilChanged((a, b) => a.ID === b.ID),
      switchMap(form =>
        timer(5000).pipe(
          map(() => form)
        )
      ),
      takeUntilDestroyed()
    ).subscribe(form => {
      this.setFormRead(form.ID);
    });

    this.reloadForms();
  }

  async reloadForms() {
    const forms = await firstValueFrom(
      this.cmsRequestService.getSubmittedForms()
    );
    this.forms.set(forms);
  }

  async toForm(id: string) {
    await this.router.navigate(['formulare', id]);
  }

  private async setFormRead(id: string) {
    if(this.selectedForm()?.LastModifiedBy) {
      //already set to read
      return;
    }
    await firstValueFrom(this.cmsRequestService.readSubmittedForm(id));
    const userId = this.authService.getLoggedInUser()?.ID;

    const formInList = this.forms().find(cForm => cForm.ID === id);

    if (formInList) {
      formInList.LastModifiedBy = userId;
    }

    this.selectedForm()!.LastModifiedBy = userId;
  }

  async deleteForm() {
    if (!(await this.alertService.confirmDelete())) return;
    await firstValueFrom(
      this.cmsRequestService.deleteSubmittedForms([this.selectedForm()!.ID])
    );
    this.forms.update((forms) =>
      forms.filter((f) => f.ID !== this.selectedForm()!.ID)
    );
    this.selectedForm.set(this.forms()[0]);
  }
}

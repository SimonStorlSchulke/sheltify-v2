import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertService } from '@app/services/alert.service';
import { CmsRequestService } from '@app/services/cms-request.service';
import { ModalService } from '@app/services/modal.service';
import { AdministrationComponent } from './administration.component';

describe('AdministrationComponent', () => {
  let component: AdministrationComponent;
  let openFinishable: ReturnType<typeof vi.fn>;
  let openToast: ReturnType<typeof vi.fn>;
  let createTenant: ReturnType<typeof vi.fn>;

  /** answers the text input modals in order */
  const answer = (...answers: (string | undefined)[]) => {
    for (const a of answers) openFinishable.mockResolvedValueOnce(a);
  };

  beforeEach(() => {
    openFinishable = vi.fn();
    openToast = vi.fn();
    createTenant = vi.fn(() => of({ TenantID: 'tierheim' }));
    TestBed.configureTestingModule({
      imports: [AdministrationComponent],
      providers: [
        { provide: ModalService, useValue: { openFinishable } },
        { provide: AlertService, useValue: { openToast } },
        {
          provide: CmsRequestService,
          useValue: { getUsers: () => of([]), getTenants: () => of([]), createTenant },
        },
      ],
    });
    component = TestBed.createComponent(AdministrationComponent).componentInstance;
  });

  it('creates a tenant', async () => {
    answer('tierheim', 'Tierheim', 'https://tierheim.example');
    expect(await component.createTenant()).toEqual({ TenantID: 'tierheim' });
    expect(createTenant).toHaveBeenCalledWith('tierheim', 'Tierheim', 'https://tierheim.example');
  });

  it.each(['Tierheim', 'tier-heim', 'tierheim1', 'tier heim'])('rejects the invalid tenant id "%s"', async id => {
    answer(id);
    expect(await component.createTenant()).toBeUndefined();
    expect(openToast).toHaveBeenCalled();
    expect(createTenant).not.toHaveBeenCalled();
  });

  it('aborts when a modal is cancelled', async () => {
    answer('tierheim', undefined);
    expect(await component.createTenant()).toBeUndefined();
    expect(createTenant).not.toHaveBeenCalled();
  });
});

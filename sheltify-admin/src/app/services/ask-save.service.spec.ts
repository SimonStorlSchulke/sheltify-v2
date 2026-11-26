import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';
import { AskSaveService } from './ask-save.service';

describe('AskSaveService', () => {
  let service: AskSaveService;
  let openAlert: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openAlert = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: AlertService, useValue: { openAlert } }],
    });
    service = TestBed.inject(AskSaveService);
  });

  it('tracks dirty ids', () => {
    service.markDirty('a');
    service.markDirty('b');
    expect(service.dirty()).toBe(true);
    expect(service.isIdDirty('a')).toBe(true);
    expect([...service.getDirtyIds()]).toEqual(['a', 'b']);
  });

  it('stays dirty until the last id is cleaned', () => {
    service.markDirty('a');
    service.markDirty('b');
    service.cleanId('a');
    expect(service.dirty()).toBe(true);
    service.cleanId('b');
    expect(service.dirty()).toBe(false);
  });

  it('can be dirty without an id', () => {
    service.markDirty();
    expect(service.dirty()).toBe(true);
    expect(service.getDirtyIds().size).toBe(0);
    service.clean();
    expect(service.dirty()).toBe(false);
  });

  describe('askSave', () => {
    it('allows leaving without asking when nothing is dirty', async () => {
      expect(await service.askSave()).toBe(true);
      expect(openAlert).not.toHaveBeenCalled();
    });

    it('triggers a save of the dirty ids on "ja"', async () => {
      openAlert.mockResolvedValue('ja');
      const saved: string[][] = [];
      service.triggerSave$.subscribe(ids => saved.push(ids));
      service.markDirty('a');

      expect(await service.askSave()).toBe(true);
      expect(saved).toEqual([['a']]);
      expect(service.dirty()).toBe(false);
    });

    it('discards changes on "nein"', async () => {
      openAlert.mockResolvedValue('nein');
      const save = vi.fn();
      service.triggerSave$.subscribe(save);
      service.markDirty('a');

      expect(await service.askSave()).toBe(true);
      expect(save).not.toHaveBeenCalled();
      expect(service.dirty()).toBe(false);
    });

    it('prevents leaving on "abbrechen"', async () => {
      openAlert.mockResolvedValue('abbrechen');
      service.markDirty('a');
      expect(await service.askSave()).toBe(false);
    });
  });
});

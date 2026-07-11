import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AskSaveService } from '@app/services/ask-save.service';

export const askSaveGuard: CanDeactivateFn<unknown> = async (component, currentRoute, currentState, nextState) => {
  const askSaveService = inject(AskSaveService);
  return await askSaveService.askSave();
};

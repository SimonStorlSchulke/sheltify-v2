import { test } from '@playwright/test';
import { AnimalEditor } from '../animal-editor';

test('create and delete new animal article', async ({ page }) => {
  const p = new AnimalEditor(page);
  await p.start();
  await p.newAnimal('Nina');

  await p.form.locator('#portrait').click();

  await p.setPortrait('nina.jpg');

  await p.createArticleForCurrentAnimal();
  await p.articleEditor.addRow(0, 'title');
  const articleText = 'The Adventures of Nina';
  await p.articleEditor.getSectionEditor(0).locator('input[name="title"]').fill(articleText);
  await p.save();
  await p.articleEditor.expectTextInPreview(0, 0, articleText);
  await p.page.reload();
  await p.articleEditor.expectTextInPreview(0, 0, articleText);
  await p.deleteAnimal('Nina');
});

test.skip('animals can share article', async ({ page }) => {
  const p = new AnimalEditor(page);
  await p.start();
  await p.newAnimal('Vito');
  await p.createArticleForCurrentAnimal();
  await p.articleEditor.addRow(0, 'title');
  const articleText = 'Vito und Benito sind flauschig';
  await p.articleEditor.getSectionEditor(0).locator('input[name="title"]').fill(articleText);
  await p.save();
  await p.newAnimal('Benito');
  await p.assignExistingArticleToCurrentAnimal('Vito');
  await p.save();
  await p.page.reload();
  await p.toAnimal('Vito');
  await p.articleEditor.expectTextInPreview(0, 0, articleText);
  await p.toAnimal('Benito');
  await p.page.reload();
  await p.articleEditor.expectTextInPreview(0, 0, articleText);
  await p.deleteAnimal('Benito');
  await p.toAnimal('Vito');
  await p.page.reload();
  await p.articleEditor.expectTextInPreview(0, 0, articleText);
  await p.deleteAnimal('Vito');
});


test('halp', async ({ page }) => {
  await page.goto('https://vnc-console.strato.de/console/client/vnc/?token=eyJ0eXAiOiJKV1QiLCJraWQiOiI0MWM1MDFlNC03NGY3LTQwYjctYmMxMi1lZWIzMTAzNThlZDkiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpb25vc2Nsb3VkIiwiaWF0IjoxNzg0NzU1ODYwLCJzZXJ2ZXIiOnsidXVpZCI6IjcyOGNlYzk0LTViODQtNDAzNS1iM2RkLWY2NWMyMzk2MTA5OSIsIm5hbWUiOiJiYjYzNGU3Yi0wZDQxLTQzZWItODg0NC0xMjM2MjBiZTJhNmIifX0.Ep4LVUkDqjqZzprgg1nwHEkIu9xisgVJISHWJXc_QYSAC3zaAlTpFIxi3tUWyd9eqXVdeW45BM_VDMHtH4F7_ziYvZlXxrRWJ3-Yp6Go0w21sBW1j2I83ahgyZwXxwkh-HtqUicnOcOorw-xK5OG5PfBTL1agW6s46y1XoLOZ0lnyNNoMMMW9rRI9qGMAGEUDgbPPUCfwGSqMtWV_6Ws7x8LqOWAiW9i8WMlNnSuEGGhXUZRF_4uXZDWZ0BbkRxK3w4Zj1Y9m68oyhstB9scQkOSRvDLZM1HPaQgSoMoze34AKNQF1ZqXspbITg-S4yMJGIrvMjZkRX9My5X15uK5A');
  await page.waitForTimeout(10000);
  await page.locator('body').pressSequentially(`ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCMgoj0DUKojbe24VwXH4Caek47hgl9skMvRTjaichmgyYINRTUtr0/TeVLP7liNnvlhsqVIoYnlP8UaAge107v/kFKHeCiBz7KFQCoVUWo9P7g8908xZAWDw5/WGBxyX03xf5r1wXCR2qP1PuWKTSy1w7QfG8nvo2iODPgaRhcHqC3jGyNEvEHakpopCZDE9VKyII3nC+bGgw+0yveH26jAauARZ+yJBz8F0JZt5VEZrlMBsMpLHfFhIsBPY0xzbpT8kAt4hFoenCNIZ2cyoAw3dJABoDZNtHkuzLmEMuC6k3pZSeENlR+yt0pEr+vT+P22G5nD2pS6hPEHSb2/+KT rsa-key-20260722`);
});

/*

77017154
GsEh6R3S83eTNtS

*/
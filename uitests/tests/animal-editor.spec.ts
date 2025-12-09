import { test, expect } from '@playwright/test';
import { AnimalEditor } from '../animal-editor';

test('create and delete new animal article', async ({ page }) => {
  const p = new AnimalEditor(page);
  await p.start();
  await p.newAnimal('Fluffy');
  await p.page.getByTestId('btn-create-article-for-animal').click();
  await p.articleEditor.addRow(0, 'title');
  await p.articleEditor.getSectionEditor(0, 0).locator('input[name="title"]').fill('The Adventures of Fluffy');
  await p.articleEditor.save();
  await p.page.reload();
  await expect(p.articleEditor.getSectionPreview(0, 0)).toContainText('The Adventures of Fluffy');
  await p.deleteAnimal('Fluffy');
});

import { test } from '@playwright/test';
import { AnimalEditor } from '../animal-editor';
import { MediaLibrary } from '../media-library';

test('create and delete new animal article', async ({ page }) => {
  const p = new AnimalEditor(page);
  await p.start();
  await p.newAnimal('Nina');

  await p.form.locator('#portrait').click();

  p.setPortrait('nina.jpg');

  await p.createArticleForCurrentAnimal();
  await p.articleEditor.addRow(0, 'title');
  const articleText = 'The Adventures of Nina';
  await p.articleEditor.getSectionEditor(0, 0).locator('input[name="title"]').fill(articleText);
  await p.save();
  await p.articleEditor.expectTextInPreview(0, 0, articleText);
  await p.page.reload();
  await p.articleEditor.expectTextInPreview(0, 0, articleText);
  await p.deleteAnimal('Nina');
});

test('animals can share article', async ({ page }) => {
  const p = new AnimalEditor(page);
  await p.start();
  await p.newAnimal('Vito');
  await p.createArticleForCurrentAnimal();
  await p.articleEditor.addRow(0, 'title');
  const articleText = 'Vito und Benito sind flauschig';
  await p.articleEditor.getSectionEditor(0, 0).locator('input[name="title"]').fill(articleText);
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
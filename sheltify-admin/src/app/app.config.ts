import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxEditorModule } from 'ngx-editor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideToastr(),
    provideAnimations(),
    importProvidersFrom(NgxEditorModule.forRoot({
      locals: {
        bold: 'Fett',
        italic: 'Italic',
        underline: 'Unterstrichen',
        strike: 'Durchgestrichen',
        blockquote: 'Blockquote',
        bullet_list: 'Liste',
        ordered_list: 'Geordnete Liste',
        heading: 'Überschrift',
        h1: 'Überschrift 1',
        h2: 'Überschrift 2',
        h3: 'Überschrift 3',
        h4: 'Überschrift 4',
        h5: 'Überschrift 5',
        h6: 'Überschrift 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Farbe',
        background_color: 'Hintergrundfarbe',
        horizontal_rule: 'Horizontal rule',
        format_clear: 'Clear Formatting',
        insertLink: 'Link einfügen',
        removeLink: 'Link entfernen',
        insertImage: 'Insert Image',
        indent: 'Increase Indent',
        outdent: 'Decrease Indent',
        superscript: 'Superscript',
        subscript: 'Subscript',
        undo: 'Rückgängig',
        redo: 'Wiederholen',

        // pupups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
        enterValidUrl: 'Please enter a valid URL',
      },
    }))
  ]
};

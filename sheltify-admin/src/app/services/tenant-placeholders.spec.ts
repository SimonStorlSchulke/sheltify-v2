import { CmsTenantConfiguration } from 'sheltify-lib/cms-types';
import { resolveTenantPlaceholders, tenantPlaceholder } from 'sheltify-lib/tenant-placeholders';

const config = {
  Name: 'Tierhilfe e.V.',
  Address: 'Hauptstr. 1\n12345 Berlin',
  Email: 'info@example.org',
  PhoneNumber: '',
  IBAN: '<b>DE00</b>',
} as CmsTenantConfiguration;

describe('resolveTenantPlaceholders', () => {
  it('replaces placeholders with the configuration values', () => {
    expect(resolveTenantPlaceholders('<p>Mail: {{Email}}, {{Name}}</p>', config))
      .toBe('<p>Mail: info@example.org, Tierhilfe e.V.</p>');
  });

  it('renders line breaks of multi-line values', () => {
    expect(resolveTenantPlaceholders(`<p>${tenantPlaceholder('Address')}</p>`, config))
      .toBe('<p>Hauptstr. 1<br>12345 Berlin</p>');
  });

  it('escapes html in values', () => {
    expect(resolveTenantPlaceholders('{{IBAN}}', config)).toBe('&lt;b&gt;DE00&lt;/b&gt;');
  });

  it('replaces empty values with nothing and keeps unknown placeholders', () => {
    expect(resolveTenantPlaceholders('{{PhoneNumber}}|{{ArticleCss}}|{{Foo}}', config)).toBe('|{{ArticleCss}}|{{Foo}}');
  });

  it('returns the html unchanged without config', () => {
    expect(resolveTenantPlaceholders('{{Email}}', undefined)).toBe('{{Email}}');
  });
});

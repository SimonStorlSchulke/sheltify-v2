import { CmsTenantConfiguration } from './cms-types';

/**
 * Fields of the tenant configuration that can be inserted into texts as placeholder,
 * e.g. "{{Address}}". The article-renderer replaces the placeholders with the current values.
 */
export const TENANT_PLACEHOLDER_FIELDS = [
  { key: 'Name', label: 'Name' },
  { key: 'Address', label: 'Adresse' },
  { key: 'Email', label: 'Email' },
  { key: 'PhoneNumber', label: 'Telefonnummer' },
  { key: 'IBAN', label: 'Bankverbindung' },
  { key: 'Chairmanship', label: 'Vorsitz' },
  { key: 'SiteUrl', label: 'Webseiten-Url' },
  { key: 'LinkPaypal', label: 'Paypal' },
  { key: 'LinkInstagram', label: 'Instagram' },
  { key: 'LinkFacebook', label: 'Facebook' },
  { key: 'LinkTiktok', label: 'Tiktok' },
  { key: 'LinkYoutube', label: 'Youtube' },
] as const satisfies readonly { key: keyof CmsTenantConfiguration; label: string }[];

export type TenantPlaceholderKey = typeof TENANT_PLACEHOLDER_FIELDS[number]['key'];

export function tenantPlaceholder(key: TenantPlaceholderKey): string {
  return `{{${key}}}`;
}

const PLACEHOLDER_KEYS = new Set<string>(TENANT_PLACEHOLDER_FIELDS.map(field => field.key));

/**
 * Replaces placeholders like "{{Address}}" in the given html with the (html escaped) value of the tenant
 * configuration. Line breaks of multi-line values (e.g. the address) are rendered as <br>.
 * Unknown placeholders are left untouched; without a config the html is returned unchanged.
 */
export function resolveTenantPlaceholders(html: string, config: CmsTenantConfiguration | undefined | null): string {
  if (!config || !html?.includes('{{')) return html;

  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (placeholder, key: string) => {
    if (!PLACEHOLDER_KEYS.has(key)) return placeholder;
    const value = config[key as TenantPlaceholderKey] ?? '';
    return escapeHtml(String(value)).replace(/\r?\n/g, '<br>');
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

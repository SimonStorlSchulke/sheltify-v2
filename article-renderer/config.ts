const isProd =
  (import.meta as any).env?.ENVIRONMENT === 'production' ||
  (typeof window !== 'undefined' &&
    !window.location.origin.startsWith('http://localhost'));

export const config = {
  uploadsUrl: isProd
    ? 'https://editor.sheltify.de/api/uploads/'
    : 'http://localhost:3000/api/uploads/',

  staticUrl: isProd
    ? 'https://editor.sheltify.de/api/static/'
    : 'http://localhost:3000/api/static/',
};
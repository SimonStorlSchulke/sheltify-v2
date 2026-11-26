import { CmsImage } from 'sheltify-lib/cms-types';
import { getImageFormatUrl, getLargestAvailableImageSize } from './article-renderer';

function image(partial: Partial<CmsImage>): CmsImage {
  return { ID: 'img1', OriginalFileName: 'dog.jpg', LargestAvailableSize: 'large', ...partial } as CmsImage;
}

describe('getLargestAvailableImageSize', () => {
  it('returns the requested size when it is available', () => {
    expect(getLargestAvailableImageSize('small', image({ LargestAvailableSize: 'large' }))).toBe('small');
    expect(getLargestAvailableImageSize('large', image({ LargestAvailableSize: 'large' }))).toBe('large');
  });

  it('falls back to the largest available size', () => {
    expect(getLargestAvailableImageSize('xlarge', image({ LargestAvailableSize: 'medium' }))).toBe('medium');
    expect(getLargestAvailableImageSize('large', image({ LargestAvailableSize: 'thumbnail' }))).toBe('thumbnail');
  });
});

describe('getImageFormatUrl', () => {
  it('points to the scaled webp of the best available size', () => {
    expect(getImageFormatUrl(image({ LargestAvailableSize: 'medium' }), 'xlarge')).toBe('/api/uploads/img1_medium.webp');
  });

  it('points to the original file for svgs', () => {
    expect(getImageFormatUrl(image({ OriginalFileName: 'Logo.SVG' }), 'small')).toBe('/api/uploads/img1.svg');
  });
});

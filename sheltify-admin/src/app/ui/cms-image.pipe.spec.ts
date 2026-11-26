import { CmsImage } from 'sheltify-lib/cms-types';
import { CmsImagePipe } from './cms-image.pipe';

describe('CmsImagePipe', () => {
  const pipe = new CmsImagePipe();
  const image = { ID: 'img1', OriginalFileName: 'dog.jpg', LargestAvailableSize: 'xlarge' } as CmsImage;

  it('returns a placeholder for missing images', () => {
    expect(pipe.transform(null)).toMatch(/\.svg$/);
    expect(pipe.transform(undefined)).toMatch(/\.svg$/);
  });

  it('uses the large size by default', () => {
    expect(pipe.transform(image)).toBe('/api/uploads/img1_large.webp');
  });

  it('uses the requested size', () => {
    expect(pipe.transform(image, 'thumbnail')).toBe('/api/uploads/img1_thumbnail.webp');
  });
});

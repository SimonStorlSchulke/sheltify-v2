export type StrapiMedia = {
  id: number
  name: string
  alternativeText: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail: {
      url: string
    },
    small?: {
      url: string
    },
    medium?: {
      url: string
    },
    large?: {
      url: string
    },
    xlarge?: {
      url: string
    },
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: any
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
}
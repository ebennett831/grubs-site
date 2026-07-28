export interface SanityReference {
  _ref?: string | null;
  _type?: "reference" | null;
  _weak?: boolean | null;
}

export interface SanityImageDimensions {
  aspectRatio?: number | null;
  height?: number | null;
  width?: number | null;
}

export interface SanityImageCrop {
  _type?: "sanity.imageCrop" | null;
  bottom?: number | null;
  left?: number | null;
  right?: number | null;
  top?: number | null;
}

export interface SanityImageHotspot {
  _type?: "sanity.imageHotspot" | null;
  height?: number | null;
  width?: number | null;
  x?: number | null;
  y?: number | null;
}

export interface SanityImage {
  _type?: "image" | null;
  asset?: SanityReference | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
  lqip?: string | null;
  dimensions?: SanityImageDimensions | null;
  alt?: string | null;
}

export type SanityImageWithAsset = SanityImage & {
  asset: SanityReference & {
    _ref: string;
  };
};

export interface SanitySlug {
  _type?: "slug" | null;
  current?: string | null;
}

export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "email"
  | "website"
  | "x"
  | "facebook"
  | "youtube"
  | "vimeo"
  | "tiktok"
  | "behance"
  | "threads"
  | "bluesky"
  | "custom";

export interface SocialLink {
  _key?: string | null;
  _type?: "socialLink" | null;
  platform?: SocialPlatform | string | null;
  label?: string | null;
  url?: string | null;
  showInFooter?: boolean | null;
  showOnAboutPage?: boolean | null;
}

export interface SanityFileAsset {
  _id?: string | null;
  _type?: "sanity.fileAsset" | null;
  url?: string | null;
  originalFilename?: string | null;
  mimeType?: string | null;
  size?: number | null;
}

export interface SanityFile {
  _type?: "file" | null;
  asset?: SanityFileAsset | null;
}

export interface SanityColor {
  _type?: "color" | null;
  hex?: string | null;
}

export interface Photographer {
  _id?: string | null;
  _type?: "photographer" | null;
  name?: string | null;
  bio?: string | null;
  profileImage?: SanityImage | null;
  socialLinks?: Array<SocialLink | null>;
  email?: string | null;
}

export interface HomePageSettings {
  _id?: string | null;
  _type?: "homePageSettings" | null;
  heroEyebrow?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroImage?: SanityImage | null;
  heroImageAlt?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  featuredEyebrow?: string | null;
  featuredTitle?: string | null;
  featuredDescription?: string | null;
  featuredPhotos?: Array<Photo | null>;
  galleriesLinkLabel?: string | null;
  galleriesLinkDescription?: string | null;
  photographyLinkLabel?: string | null;
  photographyLinkDescription?: string | null;
  aboutLinkLabel?: string | null;
  aboutLinkDescription?: string | null;
}

export interface GallerySummary {
  _id?: string | null;
  _type?: "gallery" | null;
  title?: string | null;
  slug?: SanitySlug | null;
  sortOrder?: number | null;
}

export interface GalleryCoverPhoto {
  _id?: string | null;
  _type?: "photo" | null;
  image?: SanityImage | null;
  altText?: string | null;
}

export interface Gallery extends GallerySummary {
  description?: string | null;
  coverPhoto?: GalleryCoverPhoto | null;
  photoCount?: number | null;
}

export interface GalleryWithPhotos extends Gallery {
  photos?: Array<Photo | null>;
}

export interface AboutPageSettings {
  _id?: string | null;
  _type?: "aboutPageSettings" | null;
  eyebrow?: string | null;
  pageTitle?: string | null;
  intro?: string | null;
  body?: string | null;
  secondaryHeading?: string | null;
  locationLine?: string | null;
  availabilityStatement?: string | null;
  portraitImage?: SanityImage | null;
  portraitImageAlt?: string | null;
  socialSectionHeading?: string | null;
  resumeLabel?: string | null;
  resumeDescription?: string | null;
  resumeFile?: SanityFile | null;
}

export interface Photo {
  _id?: string | null;
  _type?: "photo" | null;
  image?: SanityImage | null;
  altText?: string | null;
  title?: string | null;
  caption?: string | null;
  location?: string | null;
  dateTaken?: string | null;
  gallery?: GallerySummary | null;
}

export interface SiteSettings {
  _id?: string | null;
  _type?: "siteSettings" | null;
  siteTitle?: string | null;
  siteDescription?: string | null;
  accentColor?: SanityColor | null;
  contactEmail?: string | null;
  footerEyebrow?: string | null;
  footerHeading?: string | null;
  footerDescription?: string | null;
  footerLocation?: string | null;
  footerCopyrightName?: string | null;
  ogImage?: SanityImage | null;
  favicon?: SanityImage | null;
  socialLinks?: Array<SocialLink | null>;
}

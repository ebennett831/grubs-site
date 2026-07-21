export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  lqip?: string;
  dimensions?: {
    aspectRatio: number;
    height: number;
    width: number;
  };
  alt?: string;
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
  _key?: string;
  platform?: SocialPlatform | string;
  label?: string;
  url?: string;
  showInFooter?: boolean;
  showOnAboutPage?: boolean;
}

export interface SanityFileAsset {
  url?: string;
  originalFilename?: string;
  mimeType?: string;
}

export interface Photographer {
  _id: string;
  _type: "photographer";
  name?: string;
  bio?: string;
  profileImage?: SanityImage;
  socialLinks?: SocialLink[];
  email?: string;
}

export interface HomePageSettings {
  _id: string;
  _type: "homePageSettings";
  heroEyebrow?: string;
  heroTitle: string;
  heroDescription?: string;
  heroImage?: SanityImage;
  heroImageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  featuredEyebrow?: string;
  featuredTitle?: string;
  featuredDescription?: string;
  featuredPhotos?: Photo[];
  galleriesLinkLabel?: string;
  galleriesLinkDescription?: string;
  photographyLinkLabel?: string;
  photographyLinkDescription?: string;
  aboutLinkLabel?: string;
  aboutLinkDescription?: string;
}

export interface GalleryCoverPhoto {
  _id: string;
  _type: "photo";
  image?: SanityImage;
  altText: string;
}

export interface Gallery {
  _id: string;
  _type: "gallery";
  title: string;
  description?: string;
  slug: {
    current: string;
  };
  sortOrder: number;
  coverPhoto?: GalleryCoverPhoto;
  photoCount?: number;
}

export interface AboutPageSettings {
  _id: string;
  _type: "aboutPageSettings";
  eyebrow?: string;
  pageTitle?: string;
  intro?: string;
  body?: string;
  secondaryHeading?: string;
  locationLine?: string;
  availabilityStatement?: string;
  portraitImage?: SanityImage;
  portraitImageAlt?: string;
  socialSectionHeading?: string;
  resumeLabel?: string;
  resumeDescription?: string;
  resumeFile?: {
    asset?: SanityFileAsset;
  };
}

export interface Photo {
  _id: string;
  _type: "photo";
  image?: SanityImage;
  altText: string;
  title?: string;
  caption?: string;
  location?: string;
  dateTaken?: string;
  gallery?: {
    _id: string;
    _type: "gallery";
    title: string;
    sortOrder: number;
  };
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  siteTitle?: string;
  siteDescription?: string;
  contactEmail?: string;
  footerEyebrow?: string;
  footerHeading?: string;
  footerDescription?: string;
  footerLocation?: string;
  footerCopyrightName?: string;
  ogImage?: SanityImage;
  favicon?: SanityImage;
  socialLinks?: SocialLink[];
}

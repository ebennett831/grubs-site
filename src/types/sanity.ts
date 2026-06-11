export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  dimensions?: {
    aspectRatio: number;
    height: number;
    width: number;
  };
  alt?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Photographer {
  _id: string;
  _type: "photographer";
  name: string;
  bio: string;
  profileImage?: SanityImage;
  socialLinks: SocialLink[];
  email: string;
}

export interface HomePageSettings {
  _id: string;
  _type: "homePageSettings";
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: SanityImage;
  sectionTitle: string;
  sectionDescription: string;
  ctaLabel: string;
}

export interface GallerySettings {
  _id: string;
  _type: "gallerySettings";
  density: number;
}

export interface AboutPageSettings {
  _id: string;
  _type: "aboutPageSettings";
  pageTitle: string;
  intro: string;
  body: string;
  portraitImage?: SanityImage;
}

export interface Photo {
  _id: string;
  _type: "photo";
  image?: SanityImage;
  altText: string;
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  siteTitle: string;
  siteDescription: string;
  ogImage?: SanityImage;
  favicon?: SanityImage;
  socialLinks: SocialLink[];
}

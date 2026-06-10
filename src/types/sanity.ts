export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
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

export interface Gallery {
  _id: string;
  _type: "gallery";
  title: string;
  slug: string;
  coverImage?: SanityImage;
  description: string;
  featured: boolean;
  sortOrder: number;
}

export interface Photo {
  _id: string;
  _type: "photo";
  image?: SanityImage;
  altText: string;
  location?: string;
  cameraData?: string;
  featured: boolean;
}

export interface GalleryWithPhotos extends Gallery {
  photos: Photo[];
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

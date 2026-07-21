import { groq } from "next-sanity";

const photoProjection = groq`{
  _id,
  _type,
  image{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
  altText,
  title,
  caption,
  location,
  dateTaken,
  gallery->{
    _id,
    _type,
    title,
    sortOrder
  }
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  _id,
  _type,
  siteTitle,
  siteDescription,
  contactEmail,
  footerEyebrow,
  footerHeading,
  footerDescription,
  footerLocation,
  footerCopyrightName,
  ogImage,
  favicon,
  socialLinks[]{
    _key,
    platform,
    label,
    url,
    showInFooter,
    showOnAboutPage
  }
}`;

export const homePageSettingsQuery = groq`*[_type == "homePageSettings"][0]{
  _id,
  _type,
  heroEyebrow,
  heroTitle,
  heroDescription,
  heroImage{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
  heroImageAlt,
  ctaLabel,
  ctaHref,
  featuredEyebrow,
  featuredTitle,
  featuredDescription,
  featuredPhotos[]->{
    _id,
    _type,
    image{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
    altText,
    title,
    caption,
    location,
    dateTaken,
    gallery->{
      _id,
      _type,
      title,
      sortOrder
    }
  },
  galleriesLinkLabel,
  galleriesLinkDescription,
  photographyLinkLabel,
  photographyLinkDescription,
  aboutLinkLabel,
  aboutLinkDescription
}`;

export const aboutPageSettingsQuery = groq`*[_type == "aboutPageSettings"][0]{
  _id,
  _type,
  eyebrow,
  pageTitle,
  intro,
  body,
  secondaryHeading,
  locationLine,
  availabilityStatement,
  socialSectionHeading,
  resumeLabel,
  resumeDescription,
  "resumeFile": resumeFile{
    "asset": asset->{
      url,
      originalFilename,
      mimeType
    }
  },
  portraitImageAlt,
  portraitImage{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip}
}`;

export const photographerQuery = groq`*[_type == "photographer"][0]{
  _id,
  _type,
  name,
  bio,
  profileImage{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
  socialLinks[]{
    _key,
    platform,
    label,
    url,
    showInFooter,
    showOnAboutPage
  },
  email
}`;

export const allPhotosQuery = groq`*[_type == "photo"] | order(_createdAt desc){
  _id,
  _type,
  image{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
  altText,
  title,
  caption,
  location,
  dateTaken
}`;

export const galleriesQuery = groq`*[_type == "gallery"] | order(coalesce(sortOrder, 0) desc, _createdAt desc){
  _id,
  _type,
  title,
  description,
  slug,
  sortOrder,
  coverPhoto->{
    _id,
    _type,
    image{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
    altText
  },
  "photoCount": count(*[_type == "photo" && references(^._id)])
}`;

export const ungroupedPhotosQuery = groq`*[_type == "photo" && !defined(gallery)] | order(_createdAt desc) ${photoProjection}`;

export const galleryByIdentifierQuery = groq`*[_type == "gallery" && (slug.current == $identifier || _id == $identifier)][0]{
  _id,
  _type,
  title,
  description,
  slug,
  sortOrder,
  coverPhoto->{
    _id,
    _type,
    image{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
    altText
  },
  "photos": *[_type == "photo" && references(^._id)] | order(_createdAt desc) ${photoProjection}
}`;

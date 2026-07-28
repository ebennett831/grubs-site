import { groq } from "next-sanity";

export const imageProjection = groq`{
  _type,
  asset,
  crop,
  hotspot,
  "dimensions": asset->metadata.dimensions{
    aspectRatio,
    height,
    width
  },
  "lqip": asset->metadata.lqip
}`;

export const socialLinkProjection = groq`{
  _key,
  _type,
  platform,
  label,
  url,
  showInFooter,
  showOnAboutPage
}`;

export const gallerySummaryProjection = groq`{
  _id,
  _type,
  title,
  slug,
  sortOrder
}`;

export const photoProjection = groq`{
  _id,
  _type,
  image${imageProjection},
  altText,
  title,
  caption,
  location,
  dateTaken,
  gallery->${gallerySummaryProjection}
}`;

export const galleryCoverPhotoProjection = groq`{
  _id,
  _type,
  image${imageProjection},
  altText
}`;

export const siteSettingsQuery = groq`*[
  _type == "siteSettings" &&
  _id == "siteSettings"
][0]{
  _id,
  _type,
  siteTitle,
  siteDescription,
  accentColor{hex},
  contactEmail,
  footerEyebrow,
  footerHeading,
  footerDescription,
  footerLocation,
  footerCopyrightName,
  ogImage${imageProjection},
  favicon${imageProjection},
  "socialLinks": coalesce(socialLinks[]${socialLinkProjection}, [])
}`;

export const gallerySettingsQuery = groq`*[
  _type == "gallerySettings" &&
  _id == "gallerySettings"
][0]{
    _id,
    _type,
    density
  }`;

export const homePageSettingsQuery = groq`*[
  _type == "homePageSettings" &&
  _id == "homePageSettings"
][0]{
  _id,
  _type,
  heroEyebrow,
  heroTitle,
  heroDescription,
  heroImage${imageProjection},
  heroImageAlt,
  ctaLabel,
  ctaHref,
  featuredEyebrow,
  featuredTitle,
  featuredDescription,
  "featuredPhotos": coalesce(
    array::compact(featuredPhotos[]->${photoProjection}),
    []
  ),
  galleriesLinkLabel,
  galleriesLinkDescription,
  photographyLinkLabel,
  photographyLinkDescription,
  aboutLinkLabel,
  aboutLinkDescription
}`;

export const aboutPageSettingsQuery = groq`*[
  _type == "aboutPageSettings" &&
  _id == "aboutPageSettings"
][0]{
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
    _type,
    "asset": asset->{
      _id,
      _type,
      url,
      originalFilename,
      mimeType,
      size
    }
  },
  portraitImageAlt,
  portraitImage${imageProjection}
}`;

export const allPhotosQuery = groq`*[
  _type == "photo" &&
  defined(image.asset._ref)
] | order(_createdAt desc) ${photoProjection}`;

export const homepageFallbackPhotosQuery = groq`*[
  _type == "photo" &&
  defined(image.asset._ref)
] | order(_createdAt desc)[0...6] ${photoProjection}`;

export const galleriesQuery = groq`*[_type == "gallery"] |
  order(coalesce(sortOrder, 0) desc, _createdAt desc){
    _id,
    _type,
    title,
    description,
    slug,
    sortOrder,
    coverPhoto->${galleryCoverPhotoProjection},
    "photoCount": count(*[
      _type == "photo" &&
      defined(image.asset._ref) &&
      references(^._id)
    ])
  }`;

export const ungroupedPhotosQuery = groq`*[
  _type == "photo" &&
  !defined(gallery) &&
  defined(image.asset._ref)
] | order(_createdAt desc) ${photoProjection}`;

export const galleryByIdentifierQuery = groq`*[
  _type == "gallery" &&
  (slug.current == $identifier || _id == $identifier)
][0]{
  _id,
  _type,
  title,
  description,
  slug,
  sortOrder,
  coverPhoto->${galleryCoverPhotoProjection},
  "photos": *[
    _type == "photo" &&
    defined(image.asset._ref) &&
    references(^._id)
  ] | order(_createdAt desc) ${photoProjection}
}`;

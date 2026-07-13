import { groq } from "next-sanity";

const photoProjection = groq`{
  _id,
  _type,
  image{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
  altText,
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
  ogImage,
  favicon,
  socialLinks[]{platform, url}
}`;

export const homePageSettingsQuery = groq`*[_type == "homePageSettings"][0]{
  _id,
  _type,
  heroEyebrow,
  heroTitle,
  heroDescription,
  heroImage,
  sectionTitle,
  sectionDescription,
  ctaLabel
}`;

export const gallerySettingsQuery = groq`*[_type == "gallerySettings"][0]{
  _id,
  _type,
  density
}`;

export const aboutPageSettingsQuery = groq`*[_type == "aboutPageSettings"][0]{
  _id,
  _type,
  pageTitle,
  intro,
  body,
  portraitImage
}`;

export const photographerQuery = groq`*[_type == "photographer"][0]{
  _id,
  _type,
  name,
  bio,
  profileImage,
  socialLinks[]{platform, url},
  email
}`;

export const allPhotosQuery = groq`*[_type == "photo"] | order(_createdAt desc){
  _id,
  _type,
  image{..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
  altText
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

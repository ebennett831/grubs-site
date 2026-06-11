import { groq } from "next-sanity";

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
  image{..., "dimensions": asset->metadata.dimensions},
  altText
}`;

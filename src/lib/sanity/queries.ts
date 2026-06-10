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

export const photographerQuery = groq`*[_type == "photographer"][0]{
  _id,
  _type,
  name,
  bio,
  profileImage,
  socialLinks[]{platform, url},
  email
}`;

export const galleriesQuery = groq`*[_type == "gallery"] | order(sortOrder asc, title asc){
  _id,
  _type,
  title,
  "slug": slug.current,
  coverImage,
  description,
  featured,
  sortOrder
}`;

export const featuredGalleriesQuery = groq`*[_type == "gallery" && featured == true] | order(sortOrder asc, title asc){
  _id,
  _type,
  title,
  "slug": slug.current,
  coverImage,
  description,
  featured,
  sortOrder
}`;

export const galleryBySlugQuery = groq`*[_type == "gallery" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  coverImage,
  description,
  featured,
  sortOrder,
  "photos": *[_type == "photo" && gallery._ref == ^._id] | order(featured desc, _createdAt desc){
    _id,
    _type,
    image,
    altText,
    location,
    cameraData,
    featured
  }
}`;

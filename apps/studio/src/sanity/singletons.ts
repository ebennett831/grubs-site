export const singletonDocuments = {
  homePage: {
    title: "Home Page",
    schemaType: "homePageSettings",
    documentId: "homePageSettings",
  },
  aboutPage: {
    title: "About Page",
    schemaType: "aboutPageSettings",
    documentId: "aboutPageSettings",
  },
  galleryDisplay: {
    title: "Photo Grid Display",
    schemaType: "gallerySettings",
    documentId: "gallerySettings",
  },
  siteSettings: {
    title: "Site Settings",
    schemaType: "siteSettings",
    documentId: "siteSettings",
  },
} as const;

const singletonDefinitions = Object.values(singletonDocuments);

export const singletonSchemaTypes = new Set<string>(
  singletonDefinitions.map(({ schemaType }) => schemaType),
);

export function isCanonicalSingletonDocument(
  schemaType: string,
  documentId?: string,
) {
  return singletonDefinitions.some(
    (definition) =>
      definition.schemaType === schemaType &&
      definition.documentId === documentId,
  );
}

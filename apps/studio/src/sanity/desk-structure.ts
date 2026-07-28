import type { StructureBuilder } from "sanity/structure";

import { singletonDocuments } from "./singletons";

function singletonItem(
  S: StructureBuilder,
  definition: {
    title: string;
    schemaType: string;
    documentId: string;
  },
) {
  const { title, schemaType, documentId } = definition;

  return S.listItem()
    .id(documentId)
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(documentId));
}

export function buildDeskStructure(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      singletonItem(S, singletonDocuments.homePage),
      singletonItem(S, singletonDocuments.aboutPage),
      S.divider(),
      S.listItem()
        .id("photos")
        .title("Photos")
        .child(
          S.documentTypeList("photo")
            .title("Photos")
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),
      S.listItem()
        .id("galleries")
        .title("Galleries")
        .child(
          S.documentTypeList("gallery")
            .title("Galleries")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      singletonItem(S, singletonDocuments.galleryDisplay),
      S.divider(),
      singletonItem(S, singletonDocuments.siteSettings),
    ]);
}

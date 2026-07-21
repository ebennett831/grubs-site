import type { StructureBuilder } from "sanity/structure";

function singletonItem(
  S: StructureBuilder,
  title: string,
  schemaType: string,
  documentId: string,
) {
  return S.listItem()
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(documentId));
}

export function buildDeskStructure(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      singletonItem(S, "Home Page", "homePageSettings", "homePageSettings"),
      S.listItem()
        .title("Photos")
        .child(
          S.documentTypeList("photo")
            .title("Photos")
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Galleries")
        .child(
          S.documentTypeList("gallery")
            .title("Galleries")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      singletonItem(S, "About Page", "aboutPageSettings", "aboutPageSettings"),
      singletonItem(S, "Photographer Profile", "photographer", "photographer"),
      singletonItem(S, "Site Settings", "siteSettings", "siteSettings"),
    ]);
}

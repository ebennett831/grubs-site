import {type ChangeEvent, useMemo, useState} from "react";

import {definePlugin, type Tool, useClient} from "sanity";
import {route} from "sanity/router";

const apiVersion = "2025-02-01";

function toDocumentId(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug ? `photo-${slug}` : `photo-${Date.now()}`;
}

function toAltText(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const altText = baseName.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  return altText ? altText.replace(/^./, (character) => character.toUpperCase()) : fileName;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(avif|gif|heic|heif|jpeg|jpg|png|svg|webp)$/i.test(file.name);
}

export const bulkPhotoImportTool = definePlugin(() => ({
  name: "bulk-photo-import",
  tools: [
    {
      name: "bulk-photo-import",
      title: "Bulk Photo Import",
      component: BulkPhotoImportComponent,
      router: route.create("/*"),
    },
  ],
}));

function BulkPhotoImportComponent({tool}: {tool: Tool}) {
  const client = useClient({apiVersion});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const selectedImageFiles = useMemo(
    () => selectedFiles.filter(isImageFile),
    [selectedFiles],
  );

  async function importFiles(files: File[]) {
    if (!files.length) {
      setError("Choose one or more image files first.");
      return;
    }

    setIsImporting(true);
    setError("");
    setStatus(`Importing ${files.length} file${files.length === 1 ? "" : "s"}...`);

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const asset = await client.assets.upload("image", file, {
          filename: file.name,
        });

        await client.createOrReplace(
          {
            _id: toDocumentId(file.name),
            _type: "photo",
            altText: toAltText(file.name),
            image: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: asset._id,
              },
            },
          },
          {visibility: "deferred"},
        );

        setStatus(`Imported ${index + 1} of ${files.length}: ${file.name}`);
      }

      setStatus(`Imported ${files.length} photo document${files.length === 1 ? "" : "s"}.`);
      setSelectedFiles([]);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed.");
    } finally {
      setIsImporting(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    setStatus("");

    const files = Array.from(event.target.files || []).filter(isImageFile);
    setSelectedFiles(files);

    if (files.length > 0) {
      void importFiles(files);
    }
  }

  return (
    <div style={{padding: 24}}>
      <div style={{display: "grid", gap: 24}}>
        <div style={{display: "grid", gap: 8}}>
          <h2 style={{margin: 0, fontSize: 24, fontWeight: 700}}>{tool.title}</h2>
          <p style={{margin: 0, color: "var(--card-fg-color, #6b7280)"}}>
            Choose photo files and the tool will upload them and create photo documents in the background.
            The file name becomes the alt text and the document ID.
          </p>
        </div>

        <section
          style={{
            padding: 16,
            border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
            borderRadius: 14,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{display: "grid", gap: 8}}>
            <h3 style={{margin: 0, fontSize: 18, fontWeight: 700}}>How it works</h3>
            <p style={{margin: 0}}>
              1. Click the large button below and choose one or more image files.
            </p>
            <p style={{margin: 0}}>
              2. The tool uploads each file, creates the photo document, and uses the file name as alt text.
            </p>
            <p style={{margin: 0}}>
              3. Upload the same file again if you want to update the same document.
            </p>
          </div>

          <label
            style={{
              display: "grid",
              placeItems: "center",
              minHeight: 120,
              padding: 20,
              borderRadius: 16,
              border: "2px dashed var(--card-accent-fg-color, #111827)",
              background: "linear-gradient(135deg, rgba(17,24,39,0.08), rgba(17,24,39,0.02))",
              cursor: isImporting ? "wait" : "pointer",
              textAlign: "center",
            }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{display: "none"}}
              disabled={isImporting}
            />
            <div style={{display: "grid", gap: 8}}>
              <span style={{fontSize: 18, fontWeight: 700}}>
                {isImporting ? "Importing files..." : "Choose photo files"}
              </span>
              <span style={{fontSize: 14, color: "var(--card-fg-color, #6b7280)"}}>
                Press this button to pick images from your computer.
              </span>
            </div>
          </label>

          <p style={{margin: 0, fontSize: 13, color: "var(--card-fg-color, #6b7280)"}}>
            Selected files: {selectedImageFiles.length}
          </p>

          {selectedImageFiles.length > 0 ? (
            <div
              style={{
                maxHeight: 220,
                overflow: "auto",
                padding: 12,
                border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                borderRadius: 10,
              }}
            >
              <div style={{display: "grid", gap: 4}}>
                {selectedImageFiles.map((file) => (
                  <p key={file.name} style={{margin: 0, fontSize: 13}}>
                    {file.name}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {status ? (
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.12)",
              }}
            >
              <p style={{margin: 0, fontSize: 13}}>{status}</p>
            </div>
          ) : null}

          {error ? (
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.12)",
              }}
            >
              <p style={{margin: 0, fontSize: 13}}>{error}</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
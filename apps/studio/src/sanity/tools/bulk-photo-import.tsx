import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { definePlugin, type Tool } from "sanity";

import { usePublishedClient } from "../use-published-client";

function toAltText(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const altText = baseName.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  return altText
    ? altText.replace(/^./, (character) => character.toUpperCase())
    : fileName;
}

function isImageFile(file: File) {
  return (
    file.type.startsWith("image/") ||
    /\.(avif|gif|heic|heif|jpeg|jpg|png|svg|webp)$/i.test(file.name)
  );
}

type GalleryOption = {
  _id: string;
  title: string;
};

export const bulkPhotoImportTool = definePlugin(() => ({
  name: "bulk-photo-import",
  tools: [
    {
      name: "bulk-photo-import",
      title: "Bulk Photo Import",
      component: BulkPhotoImportComponent,
    },
  ],
}));

function BulkPhotoImportComponent({ tool }: { tool: Tool }) {
  const client = usePublishedClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [galleries, setGalleries] = useState<GalleryOption[]>([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string>("");
  const [sharedDateTaken, setSharedDateTaken] = useState<string>("");
  const [sharedLocation, setSharedLocation] = useState<string>("");

  const selectedImageFiles = useMemo(
    () => selectedFiles.filter(isImageFile),
    [selectedFiles],
  );

  const loadGalleries = useCallback(async () => {
    try {
      const results = await client.fetch<GalleryOption[]>(
        `*[_type == "gallery"] | order(coalesce(sortOrder, 0) desc, _createdAt desc){
          _id,
          "title": coalesce(title, "Untitled gallery")
        }`,
      );

      setGalleries(results ?? []);
    } catch {
      setGalleries([]);
    }
  }, [client]);

  useEffect(() => {
    void loadGalleries();
  }, [loadGalleries]);

  async function importFiles(files: File[]) {
    if (!files.length) {
      setError("Choose one or more image files first.");
      return;
    }

    const galleryRef = selectedGalleryId;
    const destination = galleryRef
      ? galleries.find((gallery) => gallery._id === galleryRef)?.title ||
        "selected gallery"
      : "ungrouped";
    const dateTaken = sharedDateTaken.trim();
    const location = sharedLocation.trim();
    let completedCount = 0;
    let activeFileName = "";

    setIsImporting(true);
    setError("");
    setSuccess("");
    setStatus(
      `Importing ${files.length} file${files.length === 1 ? "" : "s"}...`,
    );

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        activeFileName = file.name;
        const asset = await client.assets.upload("image", file, {
          filename: file.name,
        });

        await client.create(
          {
            _type: "photo",
            altText: toAltText(file.name),
            ...(dateTaken ? { dateTaken } : {}),
            ...(location ? { location } : {}),
            ...(galleryRef
              ? {
                  gallery: {
                    _type: "reference",
                    _ref: galleryRef,
                  },
                }
              : {}),
            image: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: asset._id,
              },
            },
          },
          { visibility: "deferred" },
        );

        completedCount = index + 1;
        setStatus(`Imported ${index + 1} of ${files.length}: ${file.name}`);
      }

      setStatus(
        `Imported ${files.length} photo document${files.length === 1 ? "" : "s"}.`,
      );
      setSuccess(
        galleryRef
          ? `Success: added ${files.length} photo${files.length === 1 ? "" : "s"} to ${destination}.`
          : `Success: added ${files.length} ungrouped photo${files.length === 1 ? "" : "s"}.`,
      );
      setSelectedFiles([]);
      setSharedDateTaken("");
      setSharedLocation("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadGalleries();
    } catch (importError) {
      const remainingFiles = files.slice(completedCount);
      const reason =
        importError instanceof Error ? importError.message : "Import failed.";
      setSelectedFiles(remainingFiles);
      setStatus(
        completedCount
          ? `Imported ${completedCount} of ${files.length} before the error.`
          : "",
      );
      setError(
        `Could not import ${activeFileName || "the selected file"}: ${reason}`,
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsImporting(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    setStatus("");
    setSuccess("");

    const files = Array.from(event.target.files || []).filter(isImageFile);
    setSelectedFiles(files);
  }

  function handleImportClick() {
    void importFiles(selectedImageFiles);
  }

  function clearSelection() {
    setError("");
    setStatus("");
    setSuccess("");
    setSelectedFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function clearSharedMetadata() {
    setSharedDateTaken("");
    setSharedLocation("");
  }

  const selectedCountLabel = `${selectedImageFiles.length} selected`;
  const galleryLabel = selectedGalleryId
    ? galleries.find((gallery) => gallery._id === selectedGalleryId)?.title ||
      "Selected gallery"
    : "Ungrouped";

  return (
    <div
      style={{
        padding: "clamp(12px, 2.5vw, 24px)",
        color: "var(--card-fg-color, #111827)",
      }}
    >
      <div style={{ display: "grid", gap: 24, maxWidth: 1100 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            {tool.title}
          </h2>
          <p
            style={{
              margin: 0,
              color: "var(--card-muted-fg-color, #6b7280)",
            }}
          >
            Choose photo files, confirm the import, and the tool will create
            photo documents for you in the background.
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Import settings
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--card-muted-fg-color, #6b7280)",
                }}
              >
                Choose where these photos should live before you upload them.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 10px",
                  background: "var(--card-muted-bg-color, rgba(17,24,39,0.08))",
                  color: "var(--card-muted-fg-color, #6b7280)",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {selectedCountLabel}
              </span>
              <button
                type="button"
                onClick={() => void loadGalleries()}
                disabled={isImporting}
                style={{
                  appearance: "none",
                  border:
                    "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                  borderRadius: 999,
                  padding: "6px 10px",
                  background: "var(--card-bg-color, #ffffff)",
                  color: "var(--card-fg-color, #111827)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: isImporting ? "wait" : "pointer",
                }}
              >
                Refresh galleries
              </button>
            </div>
          </div>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              Add to gallery
            </span>
            <select
              value={selectedGalleryId}
              onChange={(event) => setSelectedGalleryId(event.target.value)}
              disabled={isImporting}
              style={{
                minHeight: 44,
                borderRadius: 10,
                border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                padding: "0 12px",
                background: "var(--card-bg-color, #ffffff)",
                color: "var(--input-fg-color, var(--card-fg-color, #111827))",
                cursor: isImporting ? "wait" : "pointer",
              }}
            >
              <option value="">Ungrouped</option>
              {galleries.map((gallery) => (
                <option key={gallery._id} value={gallery._id}>
                  {gallery.title}
                </option>
              ))}
            </select>
          </label>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--card-muted-fg-color, #6b7280)",
            }}
          >
            Destination: {galleryLabel}
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              paddingTop: 16,
              marginTop: 4,
              borderTop: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "start",
              }}
            >
              <div style={{ display: "grid", gap: 4 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                  Shared Metadata
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--card-muted-fg-color, #6b7280)",
                  }}
                >
                  Optional — these values will be applied to every photo in this
                  import.
                </p>
              </div>
              <button
                type="button"
                onClick={clearSharedMetadata}
                disabled={
                  isImporting || (!sharedDateTaken && !sharedLocation.trim())
                }
                style={{
                  appearance: "none",
                  border: "none",
                  padding: "4px 0",
                  background: "transparent",
                  color: "var(--card-muted-fg-color, #6b7280)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor:
                    isImporting || (!sharedDateTaken && !sharedLocation.trim())
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    isImporting || (!sharedDateTaken && !sharedLocation.trim())
                      ? 0.55
                      : 1,
                }}
              >
                Clear shared metadata
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                  Date Taken
                </span>
                <input
                  type="date"
                  value={sharedDateTaken}
                  onChange={(event) => setSharedDateTaken(event.target.value)}
                  disabled={isImporting}
                  style={{
                    minHeight: 44,
                    borderRadius: 10,
                    border:
                      "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                    padding: "0 12px",
                    background: "var(--card-bg-color, #ffffff)",
                    color:
                      "var(--input-fg-color, var(--card-fg-color, #111827))",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Location</span>
                <input
                  type="text"
                  value={sharedLocation}
                  onChange={(event) => setSharedLocation(event.target.value)}
                  disabled={isImporting}
                  maxLength={80}
                  placeholder="Optional location"
                  style={{
                    minHeight: 44,
                    borderRadius: 10,
                    border:
                      "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                    padding: "0 12px",
                    background: "var(--card-bg-color, #ffffff)",
                    color:
                      "var(--input-fg-color, var(--card-fg-color, #111827))",
                  }}
                />
              </label>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: 16,
            border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
            borderRadius: 14,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              How it works
            </h3>
            <p style={{ margin: 0 }}>
              1. Click the large button below and choose one or more image
              files.
            </p>
            <p style={{ margin: 0 }}>
              2. Review the selected files, then click Import selected photos.
            </p>
            <p style={{ margin: 0 }}>
              3. The tool uploads each file, creates the photo document, and
              uses the file name as alt text.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={isImporting}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            style={{
              appearance: "none",
              display: "grid",
              gap: 10,
              placeItems: "center",
              width: "100%",
              minHeight: 140,
              padding: 20,
              font: "inherit",
              color: "var(--card-fg-color, #111827)",
              borderRadius: 16,
              border: "2px dashed var(--card-accent-fg-color, #111827)",
              background: "var(--card-muted-bg-color, rgba(17,24,39,0.04))",
              cursor: isImporting ? "wait" : "pointer",
              textAlign: "center",
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>
                {isImporting ? "Importing files..." : "Choose photo files"}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--card-muted-fg-color, #6b7280)",
                }}
              >
                Press this button to pick images from your computer.
              </span>
            </div>
            <span
              style={{
                fontSize: 12,
                color: "var(--card-muted-fg-color, #6b7280)",
              }}
            >
              After selecting files, click Import selected photos to confirm.
            </span>
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--card-muted-fg-color, #6b7280)",
              }}
            >
              Selected files: {selectedImageFiles.length}
            </p>

            {selectedImageFiles.length > 0 ? (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleImportClick}
                  disabled={isImporting}
                  style={{
                    appearance: "none",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 16px",
                    background: "var(--card-accent-fg-color, #111827)",
                    color: "var(--card-bg-color, #ffffff)",
                    fontWeight: 700,
                    cursor: isImporting ? "wait" : "pointer",
                  }}
                >
                  {isImporting ? "Importing..." : "Import selected photos"}
                </button>

                <button
                  type="button"
                  onClick={clearSelection}
                  disabled={isImporting}
                  style={{
                    appearance: "none",
                    border:
                      "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                    borderRadius: 10,
                    padding: "12px 16px",
                    background: "var(--card-bg-color, #ffffff)",
                    color: "var(--card-fg-color, #111827)",
                    fontWeight: 700,
                    cursor: isImporting ? "wait" : "pointer",
                  }}
                >
                  Clear selection
                </button>
              </div>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--card-muted-fg-color, #6b7280)",
                }}
              >
                No files selected yet.
              </span>
            )}
          </div>

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
              <div style={{ display: "grid", gap: 4 }}>
                {selectedImageFiles.map((file, index) => (
                  <p
                    key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                    style={{ margin: 0, fontSize: 13 }}
                  >
                    {file.name}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {status ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.12)",
              }}
            >
              <p style={{ margin: 0, fontSize: 13 }}>{status}</p>
            </div>
          ) : null}

          {success ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(59, 130, 246, 0.12)",
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>
                {success}
              </p>
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.12)",
              }}
            >
              <p style={{ margin: 0, fontSize: 13 }}>{error}</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

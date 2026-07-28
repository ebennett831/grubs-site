import { type FormEvent, useEffect, useMemo, useState } from "react";

import { definePlugin, type Tool, useClient } from "sanity";
import { route } from "sanity/router";

import { urlFor } from "../image";

const apiVersion = "2025-02-01";

type GalleryOption = {
  _id: string;
  title: string;
};

type PhotoOption = {
  _id: string;
  altText: string;
  gallery?: {
    _id: string;
    title: string;
  };
  image?: {
    asset: {
      _ref: string;
    };
    dimensions?: {
      width: number;
      height: number;
    };
  };
};

export const bulkPhotoDeleteTool = definePlugin(() => ({
  name: "bulk-photo-delete",
  tools: [
    {
      name: "bulk-photo-delete",
      title: "Bulk Photo Delete",
      component: BulkPhotoDeleteComponent,
      router: route.create("/*"),
    },
  ],
}));

function BulkPhotoDeleteComponent({ tool }: { tool: Tool }) {
  const client = useClient({ apiVersion });
  const [galleries, setGalleries] = useState<GalleryOption[]>([]);
  const [photos, setPhotos] = useState<PhotoOption[]>([]);
  const [galleryId, setGalleryId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const galleryResults = await client.fetch<GalleryOption[]>(
          `*[_type == "gallery"] | order(sortOrder desc, _createdAt desc){
            _id,
            "title": coalesce(title, "Untitled gallery")
          }`,
        );

        const photoResults = galleryId
          ? await client.fetch<PhotoOption[]>(
              `*[_type == "photo" && gallery._ref == $galleryId] | order(_createdAt desc){
                _id,
                "altText": coalesce(altText, title, "Untitled photo"),
                gallery->{_id, title},
                image{asset, "dimensions": asset->metadata.dimensions}
              }`,
              { galleryId },
            )
          : await client.fetch<PhotoOption[]>(
              `*[_type == "photo" && !defined(gallery)] | order(_createdAt desc){
                _id,
                "altText": coalesce(altText, title, "Untitled photo"),
                image{asset, "dimensions": asset->metadata.dimensions}
              }`,
            );

        if (!isActive) {
          return;
        }

        setGalleries(galleryResults ?? []);
        setPhotos(photoResults ?? []);
        setSelectedIds([]);
      } catch (fetchError) {
        if (isActive) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load photos.",
          );
          setPhotos([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, [client, galleryId, reloadKey]);

  const selectedCount = selectedIds.length;

  const allVisibleSelected = useMemo(
    () =>
      photos.length > 0 &&
      photos.every((photo) => selectedIds.includes(photo._id)),
    [photos, selectedIds],
  );

  function togglePhoto(photoId: string) {
    setSelectedIds((current) =>
      current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId],
    );
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      if (photos.every((photo) => current.includes(photo._id))) {
        return current.filter(
          (id) => !photos.some((photo) => photo._id === id),
        );
      }

      return Array.from(
        new Set([...current, ...photos.map((photo) => photo._id)]),
      );
    });
  }

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setSuccess("");

    if (!selectedIds.length) {
      setError("Select one or more photos first.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} photo document${selectedIds.length === 1 ? "" : "s"}? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await Promise.all(selectedIds.map((photoId) => client.delete(photoId)));
      setStatus(
        `Deleted ${selectedIds.length} photo document${selectedIds.length === 1 ? "" : "s"}.`,
      );
      setSuccess(
        `Success: deleted ${selectedIds.length} photo document${selectedIds.length === 1 ? "" : "s"}.`,
      );
      setReloadKey((current) => current + 1);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "grid", gap: 24, maxWidth: 1200 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            {tool.title}
          </h2>
          <p style={{ margin: 0, color: "var(--card-fg-color, #6b7280)" }}>
            Pick a gallery or ungrouped photos, select the ones you want gone,
            and delete them in one batch.
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
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background: "rgba(17,24,39,0.04)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "var(--card-fg-color, #6b7280)",
                }}
              >
                Visible photos
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 20, fontWeight: 700 }}>
                {photos.length}
              </p>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background: "rgba(17,24,39,0.04)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "var(--card-fg-color, #6b7280)",
                }}
              >
                Selected
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 20, fontWeight: 700 }}>
                {selectedCount}
              </p>
            </div>
          </div>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Filter photos</span>
            <select
              value={galleryId}
              onChange={(event) => {
                const nextGalleryId = event.target.value;
                setGalleryId(nextGalleryId);
              }}
              style={{
                minHeight: 44,
                borderRadius: 10,
                border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                padding: "0 12px",
                background: "white",
              }}
            >
              <option value="">Ungrouped photos</option>
              {galleries.map((gallery) => (
                <option key={gallery._id} value={gallery._id}>
                  {gallery.title}
                </option>
              ))}
            </select>
          </label>

          <form onSubmit={handleDelete} style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={toggleAllVisible}
                disabled={!photos.length || isLoading}
                style={{
                  borderRadius: 10,
                  border:
                    "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                  padding: "10px 12px",
                  background: "white",
                  fontWeight: 700,
                  cursor:
                    !photos.length || isLoading ? "not-allowed" : "pointer",
                }}
              >
                {allVisibleSelected
                  ? "Clear visible selection"
                  : "Select all visible"}
              </button>

              <button
                type="submit"
                disabled={!selectedCount || isDeleting}
                style={{
                  appearance: "none",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 16px",
                  background: "#991b1b",
                  color: "white",
                  fontWeight: 700,
                  cursor:
                    !selectedCount || isDeleting ? "not-allowed" : "pointer",
                }}
              >
                {isDeleting
                  ? "Deleting..."
                  : `Delete selected (${selectedCount})`}
              </button>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--card-fg-color, #6b7280)",
                }}
              >
                Deleting removes the photo documents from Studio. Uploaded image
                assets are not removed.
              </p>
            </div>

            {photos.length ? (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                }}
              >
                {photos.map((photo) => {
                  const imageUrl = photo.image?.asset?._ref
                    ? urlFor(photo.image).width(600).auto("format").url()
                    : "";

                  return (
                    <label
                      key={photo._id}
                      style={{
                        display: "grid",
                        gap: 10,
                        borderRadius: 14,
                        border: selectedIds.includes(photo._id)
                          ? "2px solid var(--card-accent-fg-color, #111827)"
                          : "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                        padding: 12,
                        cursor: "pointer",
                        background: selectedIds.includes(photo._id)
                          ? "rgba(17,24,39,0.04)"
                          : "white",
                        boxShadow: selectedIds.includes(photo._id)
                          ? "0 0 0 1px rgba(17,24,39,0.08)"
                          : "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(photo._id)}
                        onChange={() => togglePhoto(photo._id)}
                        style={{
                          position: "absolute",
                          opacity: 0,
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          position: "relative",
                          aspectRatio: "4 / 3",
                          overflow: "hidden",
                          borderRadius: 10,
                          background: "rgba(0,0,0,0.05)",
                        }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={photo.altText}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                      </div>
                      <div style={{ display: "grid", gap: 4 }}>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            lineHeight: 1.4,
                          }}
                        >
                          {photo.altText}
                        </span>
                        {photo.gallery?.title ? (
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--card-fg-color, #6b7280)",
                            }}
                          >
                            {photo.gallery.title}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--card-fg-color, #6b7280)",
                            }}
                          >
                            Ungrouped
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p style={{ margin: 0, color: "var(--card-fg-color, #6b7280)" }}>
                {isLoading
                  ? "Loading photos..."
                  : "No photos match this filter."}
              </p>
            )}
          </form>
        </section>

        {status ? (
          <div
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
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(239, 68, 68, 0.12)",
            }}
          >
            <p style={{ margin: 0, fontSize: 13 }}>{error}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

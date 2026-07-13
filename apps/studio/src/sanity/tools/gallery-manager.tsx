import Image from "next/image";

import {type FormEvent, useEffect, useMemo, useState} from "react";

import {definePlugin, type Tool, useClient} from "sanity";
import {route} from "sanity/router";

import {urlFor} from "@/lib/sanity/image";

const apiVersion = "2025-02-01";

type GalleryOption = {
  _id: string;
  title: string;
  description?: string;
  slug?: {
    current?: string;
  };
  sortOrder: number;
  coverPhoto?: {
    _id: string;
    altText: string;
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
};

type PhotoOption = {
  _id: string;
  altText: string;
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

function toSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

  return slug || `gallery-${Date.now()}`;
}

export const galleryManagerTool = definePlugin(() => ({
  name: "gallery-manager",
  tools: [
    {
      name: "gallery-manager",
      title: "Gallery Manager",
      component: GalleryManagerComponent,
      router: route.create("/*"),
    },
  ],
}));

function GalleryManagerComponent({tool}: {tool: Tool}) {
  const client = useClient({apiVersion});
  const [galleries, setGalleries] = useState<GalleryOption[]>([]);
  const [photos, setPhotos] = useState<PhotoOption[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverPhotoId, setCoverPhotoId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      try {
        const [galleryResults, photoResults] = await Promise.all([
          client.fetch<GalleryOption[]>(
            `*[_type == "gallery"] | order(sortOrder desc, _createdAt desc){
              _id,
              title,
              description,
              slug,
              sortOrder,
              coverPhoto->{
                _id,
                altText,
                image{asset->{_ref}, "dimensions": asset->metadata.dimensions}
              }
            }`,
          ),
          client.fetch<PhotoOption[]>(
            `*[_type == "photo"] | order(_createdAt desc){
              _id,
              altText,
              image{asset->{_ref}, "dimensions": asset->metadata.dimensions}
            }`,
          ),
        ]);

        if (isActive) {
          setGalleries(galleryResults ?? []);
          setPhotos(photoResults ?? []);
          setCoverPhotoId((current) => current || photoResults?.[0]?._id || "");
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load galleries.");
        }
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, [client]);

  const coverPhotoOptions = useMemo(() => photos, [photos]);

  async function refresh() {
    const [galleryResults, photoResults] = await Promise.all([
      client.fetch<GalleryOption[]>(
        `*[_type == "gallery"] | order(sortOrder desc, _createdAt desc){
          _id,
          title,
          description,
          slug,
          sortOrder,
          coverPhoto->{
            _id,
            altText,
            image{asset->{_ref}, "dimensions": asset->metadata.dimensions}
          }
        }`,
      ),
      client.fetch<PhotoOption[]>(
        `*[_type == "photo"] | order(_createdAt desc){
          _id,
          altText,
          image{asset->{_ref}, "dimensions": asset->metadata.dimensions}
        }`,
      ),
    ]);

    setGalleries(galleryResults ?? []);
    setPhotos(photoResults ?? []);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setSuccess("");

    if (!title.trim()) {
      setError("Add a title first.");
      return;
    }

    setIsSaving(true);

    try {
      await client.create({
        _type: "gallery",
        title: title.trim(),
        slug: {
          _type: "slug",
          current: toSlug(title),
        },
        description: description.trim() || undefined,
        ...(coverPhotoId
          ? {
              coverPhoto: {
                _type: "reference",
                _ref: coverPhotoId,
              },
            }
          : {}),
        sortOrder: Date.now(),
      });

      setTitle("");
      setDescription("");
      setStatus("Gallery created.");
      setSuccess(`Success: created gallery \"${title.trim()}\".`);
      await refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create gallery.");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateSortOrder(index: number, direction: "up" | "down") {
    const current = galleries[index];
    const target = direction === "up" ? galleries[index - 1] : galleries[index + 1];

    if (!current || !target) {
      return;
    }

    const nextSortOrder = direction === "up" ? target.sortOrder + 1 : target.sortOrder - 1;
    await client.patch(current._id).set({sortOrder: nextSortOrder}).commit({visibility: "deferred"});
    setStatus("Gallery order updated.");
    setSuccess(`Success: moved \"${current.title}\" ${direction === "up" ? "up" : "down"}.`);
    await refresh();
  }

  return (
    <div style={{padding: 24}}>
      <div style={{display: "grid", gap: 24, maxWidth: 1100}}>
        <div style={{display: "grid", gap: 8}}>
          <h2 style={{margin: 0, fontSize: 24, fontWeight: 700}}>{tool.title}</h2>
          <p style={{margin: 0, color: "var(--card-fg-color, #6b7280)"}}>
            Create galleries, optionally pick a cover photo, and move them up or down with simple buttons.
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
          <h3 style={{margin: 0, fontSize: 18, fontWeight: 700}}>Create a gallery</h3>
          <div style={{display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"}}>
            <div style={{padding: 12, borderRadius: 12, background: "rgba(17,24,39,0.04)"}}>
              <p style={{margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--card-fg-color, #6b7280)"}}>
                Available photos
              </p>
              <p style={{margin: "6px 0 0", fontSize: 20, fontWeight: 700}}>{photos.length}</p>
            </div>
            <div style={{padding: 12, borderRadius: 12, background: "rgba(17,24,39,0.04)"}}>
              <p style={{margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--card-fg-color, #6b7280)"}}>
                Cover photo
              </p>
              <p style={{margin: "6px 0 0", fontSize: 20, fontWeight: 700}}>
                {coverPhotoId ? "Selected" : "Optional"}
              </p>
            </div>
          </div>
          <form onSubmit={handleCreate} style={{display: "grid", gap: 12}}>
            <label style={{display: "grid", gap: 8}}>
              <span style={{fontSize: 14, fontWeight: 700}}>Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="New gallery title"
                style={{
                  minHeight: 44,
                  borderRadius: 10,
                  border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                  padding: "0 12px",
                }}
              />
            </label>

            <label style={{display: "grid", gap: 8}}>
              <span style={{fontSize: 14, fontWeight: 700}}>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional short description"
                rows={3}
                style={{
                  borderRadius: 10,
                  border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                  padding: 12,
                  resize: "vertical",
                }}
              />
            </label>

            <label style={{display: "grid", gap: 8}}>
              <span style={{fontSize: 14, fontWeight: 700}}>Cover photo</span>
              <select
                value={coverPhotoId}
                onChange={(event) => setCoverPhotoId(event.target.value)}
                style={{
                  minHeight: 44,
                  borderRadius: 10,
                  border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                  padding: "0 12px",
                  background: "white",
                }}
              >
                <option value="">No cover photo</option>
                {coverPhotoOptions.map((photo) => (
                  <option key={photo._id} value={photo._id}>
                    {photo.altText}
                  </option>
                ))}
              </select>
            </label>

            <div style={{display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  appearance: "none",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 16px",
                  background: "var(--card-accent-fg-color, #111827)",
                  color: "var(--card-bg-color, #ffffff)",
                  fontWeight: 700,
                  cursor: isSaving ? "wait" : "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Create gallery"}
              </button>
              <p style={{margin: 0, fontSize: 13, color: "var(--card-fg-color, #6b7280)"}}>
                New galleries default to most recent first. You can add a cover photo later.
              </p>
            </div>
          </form>
        </section>

        {status ? (
          <div style={{padding: 12, borderRadius: 10, background: "rgba(16, 185, 129, 0.12)"}}>
            <p style={{margin: 0, fontSize: 13}}>{status}</p>
          </div>
        ) : null}

        {success ? (
          <div style={{padding: 12, borderRadius: 10, background: "rgba(59, 130, 246, 0.12)"}}>
            <p style={{margin: 0, fontSize: 13, fontWeight: 700}}>{success}</p>
          </div>
        ) : null}

        {error ? (
          <div style={{padding: 12, borderRadius: 10, background: "rgba(239, 68, 68, 0.12)"}}>
            <p style={{margin: 0, fontSize: 13}}>{error}</p>
          </div>
        ) : null}

        <section
          style={{
            padding: 16,
            border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
            borderRadius: 14,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center"}}>
            <h3 style={{margin: 0, fontSize: 18, fontWeight: 700}}>Reorder galleries</h3>
            <span style={{borderRadius: 999, padding: "6px 10px", background: "rgba(17,24,39,0.08)", fontSize: 12, fontWeight: 700}}>
              {galleries.length} total
            </span>
          </div>
          <div style={{display: "grid", gap: 12}}>
            {galleries.length ? (
              galleries.map((gallery, index) => {
                const coverImage = gallery.coverPhoto?.image;
                const imageUrl = coverImage?.asset?._ref ? urlFor(coverImage).width(240).auto("format").url() : "";
                const coverLabel = gallery.coverPhoto ? "Has cover" : "No cover yet";

                return (
                  <article
                    key={gallery._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr auto",
                      gap: 12,
                      alignItems: "center",
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                      background: "white",
                    }}
                  >
                    <div
                      style={{
                        width: 120,
                        height: 88,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "rgba(0,0,0,0.05)",
                      }}
                    >
                        {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={gallery.coverPhoto?.altText || gallery.title}
                          width={240}
                          height={176}
                          sizes="240px"
                          style={{width: "100%", height: "100%", objectFit: "cover"}}
                        />
                      ) : null}
                    </div>

                    <div style={{display: "grid", gap: 6}}>
                      <div style={{display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center"}}>
                        <h4 style={{margin: 0, fontSize: 16, fontWeight: 700}}>{gallery.title}</h4>
                        <span style={{borderRadius: 999, padding: "4px 8px", background: "rgba(17,24,39,0.08)", fontSize: 11, fontWeight: 700}}>
                          {coverLabel}
                        </span>
                      </div>
                      {gallery.description ? (
                        <p style={{margin: 0, fontSize: 13, color: "var(--card-fg-color, #6b7280)"}}>
                          {gallery.description}
                        </p>
                      ) : null}
                    </div>

                    <div style={{display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end"}}>
                      <button
                        type="button"
                        onClick={() => void updateSortOrder(index, "up")}
                        disabled={index === 0}
                        style={{
                          borderRadius: 10,
                          border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                          padding: "10px 12px",
                          background: "white",
                          fontWeight: 700,
                          cursor: index === 0 ? "not-allowed" : "pointer",
                        }}
                      >
                        Move up
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateSortOrder(index, "down")}
                        disabled={index === galleries.length - 1}
                        style={{
                          borderRadius: 10,
                          border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
                          padding: "10px 12px",
                          background: "white",
                          fontWeight: 700,
                          cursor: index === galleries.length - 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        Move down
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <p style={{margin: 0, color: "var(--card-fg-color, #6b7280)"}}>
                No galleries yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UploadCloud,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Video,
  Image as ImageIcon,
  Film,
} from "lucide-react";

/**
 * MediaUploadDialog — real video/image uploads to Supabase storage.
 * Replaces the dead "Coming Soon" toasts on the admin content page.
 *
 * Files go to the "provider-profiles" bucket under `${userId}/media/…` —
 * the storage RLS INSERT policy checks auth.uid() = (storage.foldername(name))[1],
 * so the user's id MUST be the first path segment.
 */

const BUCKET = "provider-profiles";
const MAX_BYTES = 50 * 1024 * 1024; // provider-profiles bucket limit
const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];
const VIDEO_EXTS = ["mp4", "mov", "webm", "m4v", "mpeg", "mpg", "avi", "mkv"];

export type MediaTab = "videos" | "images";

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string | null;
  kind: "image" | "video" | "other";
}

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: MediaTab;
}

const kindOf = (name: string): MediaFile["kind"] => {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (VIDEO_EXTS.includes(ext)) return "video";
  return "other";
};

const formatBytes = (bytes: number) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function MediaUploadDialog({ open, onOpenChange, initialTab = "videos" }: MediaUploadDialogProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<MediaTab>(initialTab);
  const [uploading, setUploading] = useState(false);
  const [uploadingName, setUploadingName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    if (!user?.id) return;
    setListLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(`${user.id}/media`, {
          limit: 50,
          sortBy: { column: "created_at", order: "desc" },
        });
      if (error) throw error;
      const mapped: MediaFile[] = (data || [])
        .filter((f) => f.name && !f.name.startsWith("."))
        .map((f) => {
          const path = `${user.id}/media/${f.name}`;
          const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
          return {
            name: f.name,
            url: publicUrl,
            size: (f.metadata as { size?: number } | null)?.size || 0,
            createdAt: f.created_at || null,
            kind: kindOf(f.name),
          };
        });
      setFiles(mapped);
    } catch (err: unknown) {
      console.error("Failed to list media:", err);
      toast.error("Could not load your media library.");
    } finally {
      setListLoading(false);
    }
  }, [user?.id]);

  // Reset to the requested tab and refresh the library each time the dialog opens.
  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setLastUploadedUrl(null);
      setCopiedUrl(null);
      loadFiles();
    }
  }, [open, initialTab, loadFiles]);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setCopiedUrl((current) => (current === url ? null : current)), 2000);
    } catch {
      toast.error("Couldn't copy — please copy the link manually.");
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("video/") && !file.type.startsWith("image/")) {
      toast.error("Please choose a video or image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File is larger than 50MB — please compress it first.");
      return;
    }
    if (!user?.id) {
      toast.error("Please log in again to upload media.");
      return;
    }
    setUploading(true);
    setUploadingName(file.name);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      // User id MUST be the first path segment — storage RLS checks
      // auth.uid() = (storage.foldername(name))[1].
      const path = `${user.id}/media/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setLastUploadedUrl(publicUrl);
      setTab(file.type.startsWith("video/") ? "videos" : "images");
      toast.success(`${file.type.startsWith("video/") ? "Video" : "Image"} uploaded`);
      await loadFiles();
    } catch (err: unknown) {
      console.error("Media upload failed:", err);
      const message = err instanceof Error ? err.message : "unknown error";
      toast.error("Upload failed: " + message);
    } finally {
      setUploading(false);
      setUploadingName("");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const renderList = (kind: "image" | "video") => {
    const items = files.filter((f) => f.kind === kind);
    if (listLoading) {
      return (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          <span className="sr-only">Loading media…</span>
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          {kind === "video" ? (
            <Film className="h-8 w-8 text-muted-foreground/60" aria-hidden="true" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground/60" aria-hidden="true" />
          )}
          <p className="text-sm text-muted-foreground">
            No {kind === "video" ? "videos" : "images"} yet — upload your first one above.
          </p>
        </div>
      );
    }
    return (
      <ul className="space-y-2" aria-label={kind === "video" ? "Uploaded videos" : "Uploaded images"}>
        {items.map((f) => (
          <li
            key={f.url}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-2.5"
          >
            {f.kind === "image" ? (
              <img
                src={f.url}
                alt=""
                loading="lazy"
                className="h-10 w-10 rounded-lg object-cover shrink-0 bg-muted"
              />
            ) : (
              <span className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Video className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{f.name.replace(/^\d+-/, "")}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(f.size)}
                {f.createdAt ? ` · ${new Date(f.createdAt).toLocaleDateString()}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label={`Copy link for ${f.name}`}
                onClick={() => copyUrl(f.url)}
              >
                {copiedUrl === f.url ? (
                  <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label={`Open ${f.name} in a new tab`}
                onClick={() => window.open(f.url, "_blank", "noopener,noreferrer")}
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Media library</DialogTitle>
          <DialogDescription>
            Upload videos and images, then copy a link to use anywhere on the site.
          </DialogDescription>
        </DialogHeader>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 px-4 text-center transition-colors",
            dragActive
              ? "border-primary/60 bg-primary/5"
              : "border-border/60 bg-muted/30"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 text-primary animate-spin motion-reduce:animate-none" aria-hidden="true" />
              <p className="text-sm font-medium" role="status">
                Uploading {uploadingName}…
              </p>
              <p className="text-xs text-muted-foreground">This can take a moment for larger videos.</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-medium">Drag & drop a video or image here</p>
              <p className="text-xs text-muted-foreground">MP4, MOV, WebM, JPG, PNG · up to 50MB</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse files
              </Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
        </div>

        {/* Last upload success panel */}
        {lastUploadedUrl && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2" role="status">
            <p className="text-xs font-medium text-primary">Uploaded — your file is live at:</p>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={lastUploadedUrl}
                aria-label="Public URL of uploaded file"
                className="h-8 text-xs bg-background"
                onFocus={(e) => e.currentTarget.select()}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 shrink-0"
                onClick={() => copyUrl(lastUploadedUrl)}
              >
                {copiedUrl === lastUploadedUrl ? (
                  <Check className="h-3.5 w-3.5 mr-1.5 text-primary" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                )}
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* Recent uploads */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as MediaTab)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="videos">
              <Video className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="images">
              <ImageIcon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Images
            </TabsTrigger>
          </TabsList>
          <TabsContent value="videos" className="mt-3 max-h-56 overflow-y-auto pr-1">
            {renderList("video")}
          </TabsContent>
          <TabsContent value="images" className="mt-3 max-h-56 overflow-y-auto pr-1">
            {renderList("image")}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default MediaUploadDialog;

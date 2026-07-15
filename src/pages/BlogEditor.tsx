import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { renderPostContent } from "@/lib/renderPost";
import { textFromHtml, countWordsFromHtml, excerptFromHtml } from "@/lib/textFromHtml";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RichTextEditor from "@/components/blog/RichTextEditor";
import {
  Save,
  Eye,
  Globe,
  ArrowLeft,
  Image as ImageIcon,
  Settings,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Loader2,
  History,
  X,
} from "lucide-react";

type PostState = {
  title: string;
  subtitle: string;
  content: string;
  excerpt: string;
  tags: string[];
  featured_image_url: string;
  status: "draft" | "published";
};

type LocalDraft = { post: PostState; savedAt: string };

// localStorage key for the autosaved (unsaved-to-server) draft of a post.
const draftStorageKey = (id: string) => `omni-blog-draft:${id}`;

const readLocalDraft = (key: string): LocalDraft | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.post || typeof parsed.post.content !== "string") {
      return null;
    }
    return parsed as LocalDraft;
  } catch {
    return null;
  }
};

const BlogEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams();
  const isNewPost = !postId || postId === "new";
  // Gates the form behind a spinner while an existing draft is fetched. Without
  // this, the (empty) form rendered immediately and RichTextEditor mounted with
  // value="" — if the user started typing before loadPost()'s fetch resolved,
  // the incoming setPost() below overwrote `content` wholesale, wiping what
  // they'd typed and reseeding the editor's innerHTML mid-keystroke. Reported as
  // "the editor doesn't let me type" — it types, then the load silently erases it.
  const [postLoading, setPostLoading] = useState(!isNewPost);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [post, setPost] = useState<PostState>({
    title: "",
    subtitle: "",
    content: "",
    excerpt: "",
    tags: [] as string[],
    featured_image_url: "",
    status: "draft"
  });
  const [tagInput, setTagInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(1);
  const [featuredImageFailed, setFeaturedImageFailed] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);

  // ---- Autosave (localStorage) -------------------------------------------
  const draftKey = draftStorageKey(isNewPost ? "new" : postId!);
  // A recovered local draft the user hasn't accepted or dismissed yet.
  const [restorableDraft, setRestorableDraft] = useState<LocalDraft | null>(null);
  // Serialized snapshot autosave compares against — seeded from the loaded
  // (or empty) post so we never autosave state the user hasn't touched.
  const autosaveSeed = useRef<string | null>(null);
  // Server-side updated_at of the loaded post, used to discard stale local drafts.
  const serverUpdatedAt = useRef<string | null>(null);

  // Featured cover upload → Supabase storage → public URL (mirrors RichTextEditor inline images)
  const uploadFeatured = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Image is larger than 8MB."); return; }
    setUploadingFeatured(true);
    try {
      const ext = file.name.split(".").pop();
      // User id MUST be the first path segment — the storage RLS INSERT policy
      // checks auth.uid() = (storage.foldername(name))[1]. (Was `blog-covers/<uid>/…`,
      // which put "blog-covers" first and got rejected.)
      const path = `${user?.id || "anon"}/blog-covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("provider-profiles").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("provider-profiles").getPublicUrl(path);
      setPost(prev => ({ ...prev, featured_image_url: publicUrl }));
      setFeaturedImageFailed(false);
      toast.success("Cover image added");
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed: " + (err?.message || "unknown error"));
    } finally {
      setUploadingFeatured(false);
    }
  };

  // Excerpt is always plain text: an explicit excerpt is used as-is, otherwise
  // one is derived from the content HTML with tags stripped (the WYSIWYG stores
  // HTML — without stripping, drafts showed literal "<ul><li><br></li></ul>").
  const getExcerpt = () => {
    const explicit = post.excerpt.trim();
    if (explicit) return explicit.length > 200 ? `${explicit.substring(0, 200)}...` : explicit;
    return excerptFromHtml(post.content, 200);
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!isNewPost) {
      loadPost();
    }
  }, [user, postId, isNewPost]);

  useEffect(() => {
    // Count words in the rendered text, not the raw HTML string — "<p></p>"
    // used to count as "1 words".
    const words = countWordsFromHtml(post.content);
    setWordCount(words);
    setEstimatedReadTime(Math.max(1, Math.ceil(words / 200))); // 200 words per minute
  }, [post.content]);

  // Offer to restore an unsaved local draft once the (possibly loaded) post is ready.
  useEffect(() => {
    if (postLoading) return;
    const saved = readLocalDraft(draftKey);
    if (!saved) return;
    // Stale local draft — the server copy was saved after it. Drop it quietly.
    if (serverUpdatedAt.current && saved.savedAt <= serverUpdatedAt.current) {
      localStorage.removeItem(draftKey);
      return;
    }
    const hasContent = Boolean(saved.post.title.trim() || textFromHtml(saved.post.content));
    const differs =
      saved.post.content !== post.content ||
      saved.post.title !== post.title ||
      saved.post.subtitle !== post.subtitle ||
      saved.post.excerpt !== post.excerpt;
    if (hasContent && differs) setRestorableDraft(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postLoading, draftKey]);

  // Debounced autosave: any edit is written to localStorage after ~2s of quiet,
  // so a closed tab or crash never loses work.
  useEffect(() => {
    if (postLoading) return;
    const serialized = JSON.stringify(post);
    if (autosaveSeed.current === null) {
      autosaveSeed.current = serialized; // first render with settled state — nothing edited yet
      return;
    }
    if (serialized === autosaveSeed.current) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ post, savedAt: new Date().toISOString() }));
      } catch {
        // localStorage full or unavailable — autosave is best-effort only.
      }
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [post, postLoading, draftKey]);

  const restoreLocalDraft = () => {
    if (!restorableDraft) return;
    setPost(prev => ({
      ...prev,
      ...restorableDraft.post,
      tags: Array.isArray(restorableDraft.post.tags) ? restorableDraft.post.tags : prev.tags,
    }));
    setRestorableDraft(null);
    toast.success("Unsaved draft restored");
  };

  const discardLocalDraft = () => {
    localStorage.removeItem(draftKey);
    setRestorableDraft(null);
  };

  // Called after a successful server save/publish: the local safety copy is no
  // longer needed, and the autosave baseline moves to the just-saved state.
  const clearLocalDraft = (savedPost: PostState) => {
    localStorage.removeItem(draftKey);
    localStorage.removeItem(draftStorageKey("new")); // a new post gets an id on save
    autosaveSeed.current = JSON.stringify(savedPost);
  };

  const loadPost = async () => {
    if (isNewPost) return;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      serverUpdatedAt.current = data.updated_at || data.created_at || null;
      setPost({
        title: data.title,
        subtitle: data.subtitle || "",
        // Old posts were stored as markdown; the new WYSIWYG works in HTML.
        // Normalise to HTML on load so legacy drafts open formatted, not as raw **markdown**.
        content: renderPostContent(data.content),
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        featured_image_url: data.featured_image_url || "",
        status: data.status as "draft" | "published"
      });
    } catch (error: any) {
      toast.error("Failed to load post: " + error.message);
      navigate("/blog/community");
    } finally {
      setPostLoading(false);
    }
  };

  const generateSlug = (title: string, withSuffix = true) => {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() || "community-story";
    // Append short timestamp to avoid UNIQUE constraint violations
    return withSuffix ? `${base}-${Date.now().toString(36)}` : base;
  };

  const saveDraft = async () => {
    if (!post.title.trim() || !post.content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setIsLoading(true);
    try {
      // Always get a fresh session to ensure valid auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("Please log in to save drafts");
        navigate("/auth");
        return;
      }

      const userId = session.user.id;
      const slug = generateSlug(post.title);

      let result;
      if (isNewPost) {
        result = await supabase
          .from('blog_posts')
          .insert([{
            title: post.title,
            subtitle: post.subtitle || null,
            content: post.content,
            excerpt: getExcerpt(),
            tags: post.tags.length > 0 ? post.tags : null,
            featured_image_url: post.featured_image_url || null,
            user_id: userId,
            slug,
            read_time_minutes: estimatedReadTime,
            status: "draft",
          }])
          .select()
          .single();
      } else {
        result = await supabase
          .from('blog_posts')
          .update({
            title: post.title,
            subtitle: post.subtitle || null,
            content: post.content,
            excerpt: getExcerpt(),
            tags: post.tags.length > 0 ? post.tags : null,
            featured_image_url: post.featured_image_url || null,
            read_time_minutes: estimatedReadTime,
            status: "draft",
          })
          .eq('id', postId)
          .eq('user_id', userId)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success("Draft saved successfully");
      const savedPost: PostState = { ...post, status: "draft" };
      setPost(savedPost);
      clearLocalDraft(savedPost);
      serverUpdatedAt.current = result.data?.updated_at || new Date().toISOString();
      setLastSavedAt(new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }));
      if (isNewPost && result.data?.id) {
        navigate(`/blog/editor/${result.data.id}`, { replace: true });
      }
    } catch (error: any) {
      console.error("Save draft error:", error);
      toast.error("Failed to save draft: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const publishPost = async () => {
    if (!post.title.trim() || !post.content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("Please log in to publish");
        navigate("/auth");
        return;
      }

      const userId = session.user.id;
      const slug = generateSlug(post.title);

      let result;
      if (isNewPost) {
        result = await supabase
          .from('blog_posts')
          .insert([{
            title: post.title,
            subtitle: post.subtitle || null,
            content: post.content,
            excerpt: getExcerpt(),
            tags: post.tags.length > 0 ? post.tags : null,
            featured_image_url: post.featured_image_url || null,
            user_id: userId,
            slug,
            read_time_minutes: estimatedReadTime,
            status: "published",
            published_at: new Date().toISOString(),
          }])
          .select()
          .single();
      } else {
        result = await supabase
          .from('blog_posts')
          .update({
            title: post.title,
            subtitle: post.subtitle || null,
            content: post.content,
            excerpt: getExcerpt(),
            tags: post.tags.length > 0 ? post.tags : null,
            featured_image_url: post.featured_image_url || null,
            read_time_minutes: estimatedReadTime,
            status: "published",
            published_at: post.status === "draft" ? new Date().toISOString() : undefined,
          })
          .eq('id', postId)
          .eq('user_id', userId)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success("Post published successfully!");
      clearLocalDraft({ ...post, status: "published" });
      navigate(`/blog/post/${result.data.slug}`);
    } catch (error: any) {
      toast.error("Failed to publish post: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading your draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/blog/community")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
              <div className="text-sm text-muted-foreground">
                {wordCount} {wordCount === 1 ? "word" : "words"} • {estimatedReadTime} min read
                {lastSavedAt && <span className="ml-2 text-primary">Saved {lastSavedAt}</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveDraft}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Draft"}
              </Button>
              
              <Button
                size="sm"
                onClick={publishPost}
                disabled={isLoading}
                className="bg-omni-green text-white hover:bg-omni-green/90"
              >
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Unsaved-draft recovery banner */}
        {restorableDraft && (
          <div
            role="status"
            className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4"
          >
            <History className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Restore unsaved draft?</p>
              <p className="text-xs text-muted-foreground">
                You have unsaved changes from{" "}
                {new Date(restorableDraft.savedAt).toLocaleString("en-ZA", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" "}that weren't saved to the server.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" onClick={restoreLocalDraft}>
                Restore
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={discardLocalDraft}
                aria-label="Discard unsaved draft"
              >
                <X className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Discard
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <Input
              placeholder="Your story title..."
              value={post.title}
              onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
              className="text-4xl font-bold border-none px-0 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 h-auto py-2"
              style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}
            />
            
            <Input
              placeholder="Subtitle (optional)"
              value={post.subtitle}
              onChange={(e) => setPost(prev => ({ ...prev, subtitle: e.target.value }))}
              className="text-xl text-gray-600 border-none px-0 placeholder:text-gray-400 focus-visible:ring-0 h-auto py-2"
            />
          </div>

          <Separator />

          {/* Featured Image — drag-drop / click to upload (with URL paste as fallback) */}
          {post.featured_image_url ? (
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={post.featured_image_url}
                alt="Featured"
                loading="lazy"
                decoding="async"
                onError={() => setFeaturedImageFailed(true)}
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={() => { setPost(prev => ({ ...prev, featured_image_url: "" })); setFeaturedImageFailed(false); }}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
              >
                Remove
              </button>
              {featuredImageFailed && (
                <p className="absolute bottom-0 inset-x-0 bg-destructive/90 text-white text-xs px-4 py-2">
                  This image is not loading. The post can still be saved, but the cover won't appear publicly.
                </p>
              )}
            </div>
          ) : (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) uploadFeatured(f); }}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-muted/30 transition-colors py-10 cursor-pointer text-center"
            >
              {uploadingFeatured ? (
                <Loader2 className="h-7 w-7 text-primary animate-spin" />
              ) : (
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              )}
              <div className="text-sm font-medium">{uploadingFeatured ? "Uploading…" : "Add a cover image"}</div>
              <div className="text-xs text-muted-foreground">Drag & drop, or click to choose · JPG/PNG up to 8MB</div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFeatured(f); e.target.value = ""; }}
              />
            </label>
          )}

          {/* Content Editor — true WYSIWYG (live bold/italic/headings, real image upload) */}
          <RichTextEditor
            value={post.content}
            onChange={(html) => setPost(prev => ({ ...prev, content: html }))}
            placeholder="Tell your story…"
            userId={user?.id}
          />

          <Separator />

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Excerpt (optional)
            </label>
            <Textarea
              placeholder="Brief description of your story..."
              value={post.excerpt}
              onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
              className="min-h-[100px] text-sm"
              maxLength={300}
            />
            <div className="text-xs text-gray-500">
              {post.excerpt.length}/300 characters
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={addTag}
                disabled={!tagInput.trim() || post.tags.includes(tagInput.trim())}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Social Preview */}
          {post.title && (
            <Card className="p-6 bg-gray-50">
              <h3 className="font-medium mb-4 flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Social Media Preview
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border">
                  <div className="font-medium text-blue-600 text-sm">
                    {window.location.origin}/blog/post/{isNewPost ? generateSlug(post.title, false) : postId}
                  </div>
                  <div className="font-semibold mt-1">{post.title}</div>
                  <div className="text-gray-600 text-sm mt-1">
                    {getExcerpt().substring(0, 160)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
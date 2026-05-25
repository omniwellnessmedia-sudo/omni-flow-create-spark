import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DOMPurify from "dompurify";

// Same markdown-lite → HTML conversion the public BlogPost page uses, so the
// editor preview matches exactly what readers will see.
const renderMarkdownPreview = (raw: string): string => {
  if (!raw) return "";
  const looksLikeHtml = /<\w+[\s/>]/.test(raw);
  if (looksLikeHtml) return DOMPurify.sanitize(raw);
  const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let html = esc(raw)
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => `<img src="${url}" alt="${esc(alt)}" class="rounded-lg my-4" />`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${t}</a>`)
    .replace(/^&gt; (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br />");
  if (!html.startsWith("<")) html = `<p>${html}</p>`;
  return DOMPurify.sanitize(html);
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  LinkIcon,
  ImagePlus
} from "lucide-react";
import { useRef } from "react";

const BlogEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams();
  const isNewPost = !postId || postId === "new";
  const [isLoading, setIsLoading] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [post, setPost] = useState<{
    title: string;
    subtitle: string;
    content: string;
    excerpt: string;
    tags: string[];
    featured_image_url: string;
    status: "draft" | "published";
  }>({
    title: "",
    subtitle: "",
    content: "",
    excerpt: "",
    tags: [] as string[],
    featured_image_url: "",
    status: "draft"
  });
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(1);
  const [featuredImageFailed, setFeaturedImageFailed] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const getExcerpt = () => {
    const source = post.excerpt.trim() || post.content.trim();
    return source.length > 200 ? `${source.substring(0, 200)}...` : source;
  };

  const insertMarkdown = (prefix: string, suffix = "", placeholder = "") => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = post.content.substring(start, end) || placeholder;
    const before = post.content.substring(0, start);
    const after = post.content.substring(end);
    const newContent = `${before}${prefix}${selected}${suffix}${after}`;
    setPost(prev => ({ ...prev, content: newContent }));
    // Restore cursor after state update
    setTimeout(() => {
      el.focus();
      const cursorPos = start + prefix.length + selected.length + suffix.length;
      el.setSelectionRange(cursorPos, cursorPos);
    }, 0);
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
    const words = post.content.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setEstimatedReadTime(Math.max(1, Math.ceil(words / 200))); // 200 words per minute
  }, [post.content]);

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

      setPost({
        title: data.title,
        subtitle: data.subtitle || "",
        content: data.content,
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        featured_image_url: data.featured_image_url || "",
        status: data.status as "draft" | "published"
      });
    } catch (error: any) {
      toast.error("Failed to load post: " + error.message);
      navigate("/blog/community");
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
      setPost(prev => ({ ...prev, status: "draft" }));
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
                {wordCount} words • {estimatedReadTime} min read
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

          {/* Featured Image */}
          <Card className="p-6 border-dashed">
            <div className="flex items-center gap-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <Input
                  placeholder="Featured image URL (optional)"
                  value={post.featured_image_url}
                  onChange={(e) => setPost(prev => ({ ...prev, featured_image_url: e.target.value }))}
                  className="border-none px-0 focus-visible:ring-0"
                />
              </div>
            </div>
            {post.featured_image_url && (
              <div className="mt-4">
                <img 
                  src={post.featured_image_url} 
                  alt="Featured" 
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setFeaturedImageFailed(false)}
                  onError={() => setFeaturedImageFailed(true)}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {featuredImageFailed && (
                  <p className="mt-2 text-sm text-destructive">
                    This image URL is not loading. The post can still be saved, but the image will not appear publicly.
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Content Editor with Formatting Toolbar */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-lg border">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("**", "**", "bold text")} title="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("*", "*", "italic text")} title="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("\n## ", "\n", "Heading")} title="Heading">
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("\n### ", "\n", "Subheading")} title="Subheading">
                <Heading2 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("\n- ", "\n", "list item")} title="Bullet List">
                <List className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("\n1. ", "\n", "list item")} title="Numbered List">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("\n> ", "\n", "quote")} title="Blockquote">
                <Quote className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("[", "](https://)", "link text")} title="Link">
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("![", "](https://image-url)", "alt text")} title="Image">
                <ImagePlus className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertMarkdown("`", "`", "code")} title="Inline Code">
                <Code className="h-4 w-4" />
              </Button>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  type="button"
                  variant={showPreview ? "ghost" : "secondary"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowPreview(false)}
                >
                  Write
                </Button>
                <Button
                  type="button"
                  variant={showPreview ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
            {showPreview ? (
              <div
                className="prose prose-lg max-w-none min-h-[500px] px-1 prose-headings:font-heading prose-a:text-primary"
                style={{ lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(post.content) || '<p class="text-gray-400">Nothing to preview yet — switch to Write and start typing.</p>' }}
              />
            ) : (
              <Textarea
                ref={contentRef}
                placeholder="Tell your story... Use the toolbar above for formatting, or write markdown directly."
                value={post.content}
                onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[500px] text-lg leading-relaxed border-none px-0 resize-none focus-visible:ring-0 placeholder:text-gray-400 font-mono"
                style={{ lineHeight: '1.8' }}
              />
            )}
          </div>

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
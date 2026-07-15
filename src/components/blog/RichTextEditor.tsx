import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { textFromHtml } from "@/lib/textFromHtml";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Link as LinkIcon, ImagePlus, Undo2, Redo2, Loader2,
} from "lucide-react";

/**
 * RichTextEditor — a real WYSIWYG built on contentEditable, producing sanitized
 * HTML. Replaces the old raw-markdown textarea where bold/italic "didn't work"
 * (the toolbar only inserted ** ** characters with no live formatting).
 *
 * - Live formatting: bold, italic, H2/H3, lists, quote, links render as you type.
 * - Real image upload: pick or drag-drop a file → uploads to Supabase storage →
 *   inserts the <img> at the cursor. No more pasting URLs.
 * - Output is HTML; the public BlogPost renders it via renderPostContent()
 *   (which sanitizes + passes HTML through), so what you author is what readers get.
 *
 * contentEditable is uncontrolled by design — we seed innerHTML once and only
 * re-seed when an external value arrives (e.g. loading a draft), so the caret
 * never jumps mid-typing.
 */

const STORAGE_BUCKET = "provider-profiles";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  userId?: string;
}

export function RichTextEditor({ value, onChange, placeholder, userId }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);
  const lastExternal = useRef<string>("");

  // Seed innerHTML only when an external value differs from what's in the DOM,
  // so loading a draft works but typing doesn't trigger a re-seed (caret jump).
  useEffect(() => {
    if (!editorRef.current) return;
    if (value !== lastExternal.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
      lastExternal.current = value;
      setIsEmpty(!editorRef.current.textContent?.trim());
    }
  }, [value]);

  const emit = useCallback(() => {
    if (!editorRef.current) return;
    const html = DOMPurify.sanitize(editorRef.current.innerHTML);
    lastExternal.current = html;
    setIsEmpty(!editorRef.current.textContent?.trim());
    onChange(html);
  }, [onChange]);

  // execCommand is deprecated-but-universally-supported and by far the simplest
  // reliable path for contentEditable formatting across browsers.
  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const formatBlock = (tag: string) => {
    editorRef.current?.focus();
    // Toggle: if already that block, revert to <p>
    document.execCommand("formatBlock", false, tag);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("Link URL (https://…)");
    if (!url) return;
    const safe = /^(https?:\/\/|mailto:|\/)/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    exec("createLink", safe);
  };

  const insertImageAtCursor = (url: string, alt: string) => {
    editorRef.current?.focus();
    const html = `<img src="${url}" alt="${alt}" class="rounded-xl my-6 w-full" />`;
    document.execCommand("insertHTML", false, html);
    emit();
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image is larger than 8MB — please compress it first.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      // Path MUST start with the user's id: the storage RLS INSERT policy checks
      // auth.uid() = (storage.foldername(name))[1], i.e. the FIRST path segment.
      // (Previously `blog/<uid>/…` put the literal "blog" first → policy rejected it.)
      const path = `${userId || "anon"}/blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      insertImageAtCursor(publicUrl, file.name.replace(/\.[^.]+$/, ""));
      toast.success("Image added");
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed: " + (err?.message || "unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  // Keyboard shortcuts: Ctrl/Cmd+B → bold, Ctrl/Cmd+I → italic. Browsers
  // often handle these natively in contentEditable, but going through exec()
  // guarantees onChange fires with the sanitized result.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      exec("bold");
    } else if (key === "i") {
      e.preventDefault();
      exec("italic");
    }
  };

  // Live word/character counts from the rendered text (not the raw HTML).
  const { words, chars } = useMemo(() => {
    const plain = textFromHtml(value);
    return {
      words: plain ? plain.split(/\s+/).length : 0,
      chars: plain.length,
    };
  }, [value]);

  const ToolbarButton = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden bg-card">
      {/* Sticky toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border/60 bg-muted sticky top-16 z-20">
        <ToolbarButton onClick={() => exec("bold")} title="Bold (Ctrl+B)"><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => exec("italic")} title="Italic (Ctrl+I)"><Italic className="h-4 w-4" /></ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => formatBlock("H2")} title="Heading"><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => formatBlock("H3")} title="Subheading"><Heading3 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => formatBlock("BLOCKQUOTE")} title="Quote"><Quote className="h-4 w-4" /></ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Bullet list"><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={addLink} title="Add link"><LinkIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload image">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => exec("undo")} title="Undo"><Undo2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => exec("redo")} title="Redo"><Redo2 className="h-4 w-4" /></ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }}
        />
      </div>

      {/* Editable area */}
      <div className="relative">
        {isEmpty && (
          <div className="absolute top-6 left-6 text-muted-foreground/50 pointer-events-none text-lg">
            {placeholder || "Tell your story…"}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Post content"
          onInput={emit}
          onBlur={emit}
          onKeyDown={onKeyDown}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "prose prose-lg max-w-none min-h-[460px] p-6 focus:outline-none",
            "prose-headings:font-heading prose-a:text-primary prose-blockquote:border-primary/30",
            "prose-img:rounded-xl"
          )}
          style={{ lineHeight: 1.8 }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-2 text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        <p className="min-w-0 truncate">
          Tip: <kbd className="px-1 rounded border border-border/60 bg-background font-mono text-[10px]">Ctrl</kbd>+<kbd className="px-1 rounded border border-border/60 bg-background font-mono text-[10px]">B</kbd> bold, <kbd className="px-1 rounded border border-border/60 bg-background font-mono text-[10px]">Ctrl</kbd>+<kbd className="px-1 rounded border border-border/60 bg-background font-mono text-[10px]">I</kbd> italic — or drag an image straight in.
        </p>
        <p className="shrink-0 tabular-nums" aria-live="polite">
          {words} {words === 1 ? "word" : "words"} · {chars} {chars === 1 ? "character" : "characters"}
        </p>
      </div>
    </div>
  );
}

export default RichTextEditor;

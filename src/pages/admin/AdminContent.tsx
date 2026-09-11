import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import MediaUploadDialog, { type MediaTab } from '@/components/media/MediaUploadDialog';
import { Mic, Image, Video } from 'lucide-react';

/**
 * Media: video and image uploads.
 *
 * This screen used to be the blog admin, with the video uploader hidden
 * behind one of four cards on it. The blog is gone, and taking the screen
 * with it would have taken a working feature nobody knew was there: real
 * uploads to Supabase storage, already wired and already permissioned.
 *
 * So the blog panel is gone and the uploader is the screen. Upload a video
 * is the first thing on it rather than the second card in a grid, because
 * uploading a video is now the only reason to open this page.
 *
 * The podcast card stays visibly disabled. It is on the roadmap and not
 * built, and a card that looks live but only apologises is worse than one
 * that says Planned.
 */

const AdminContent = () => {
  const [mediaTab, setMediaTab] = useState<MediaTab | null>(null);

  const actions: Array<{
    icon: JSX.Element;
    title: string;
    description: string;
    color: string;
    onClick?: () => void;
    disabled?: boolean;
    badge?: string;
  }> = [
    {
      icon: <Video className="h-5 w-5" />,
      title: 'Upload video',
      description: 'Add a video to the media library and copy its link',
      onClick: () => setMediaTab('videos'),
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
    },
    {
      icon: <Image className="h-5 w-5" />,
      title: 'Upload images',
      description: 'Add photographs and copy their links',
      onClick: () => setMediaTab('images'),
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      icon: <Mic className="h-5 w-5" />,
      title: 'New podcast episode',
      description: 'On the roadmap, not available yet',
      disabled: true,
      badge: 'Planned',
      color: 'bg-muted/40 border-border/60',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Media</h2>
        <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
          Upload a file here, then copy its link and paste it wherever it is
          needed. Files go to the shared media library, so anything you upload
          is available to whoever is building the page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              'rounded-lg border p-4 text-left transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              action.disabled && 'cursor-not-allowed opacity-70',
              action.color
            )}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className={action.disabled ? 'text-muted-foreground' : undefined}>{action.icon}</span>
              <span className={cn('text-sm font-medium', action.disabled && 'text-muted-foreground')}>
                {action.title}
              </span>
              {action.badge && (
                <Badge variant="outline" className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                  {action.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </button>
        ))}
      </div>

      <MediaUploadDialog
        open={mediaTab !== null}
        onOpenChange={(open) => {
          if (!open) setMediaTab(null);
        }}
        initialTab={mediaTab ?? 'videos'}
      />
    </div>
  );
};

export default AdminContent;

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  Eye, 
  Trash2,
  Play,
  Pause
} from "lucide-react";

interface MediaFile {
  id?: string;
  file?: File;
  preview: string;
  type: 'image' | 'video';
  title: string;
  description: string;
}

interface ProviderMediaUploadProps {
  onMediaUpdate?: () => void;
}

const ProviderMediaUpload = ({ onMediaUpdate }: ProviderMediaUploadProps) => {
  const { user } = useAuth();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingMedia, setEditingMedia] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 50MB.`);
        return;
      }

      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error(`File ${file.name} is not a supported media type.`);
        return;
      }

      const preview = URL.createObjectURL(file);
      const newMedia: MediaFile = {
        file,
        preview,
        type: isVideo ? 'video' : 'image',
        title: file.name.split('.').slice(0, -1).join('.'),
        description: ''
      };

      setMediaFiles(prev => [...prev, newMedia]);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview.startsWith('blob:')) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateMediaInfo = (index: number, field: 'title' | 'description', value: string) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      newFiles[index][field] = value;
      return newFiles;
    });
  };

  const uploadMedia = async () => {
    if (!user || mediaFiles.length === 0) return;

    setUploading(true);
    try {
      for (const media of mediaFiles) {
        if (!media.file) continue;

        // Upload file to Supabase Storage
        const fileExt = media.file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('provider-profiles')
          .upload(fileName, media.file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('provider-profiles')
          .getPublicUrl(fileName);

        // Create thumbnail for videos (using first frame or a default image)
        let thumbnailUrl = null;
        if (media.type === 'video') {
          // For videos, we could create a thumbnail, but for now use null
          thumbnailUrl = null;
        }

        // Save media record to database
        const { error: dbError } = await supabase
          .from('provider_media')
          .insert({
            provider_id: user.id,
            title: media.title,
            description: media.description,
            media_type: media.type,
            media_url: publicUrl,
            thumbnail_url: thumbnailUrl,
            file_size: media.file.size,
            active: true,
            featured: false
          });

        if (dbError) throw dbError;
      }

      toast.success("Media uploaded successfully!");
      setMediaFiles([]);
      onMediaUpdate?.();
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to upload media: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Media
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div>
          <Label htmlFor="media-upload" className="text-sm font-medium">
            Select Images or Videos
          </Label>
          <div 
            className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-omni-blue transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Images (JPEG, PNG, WebP) or Videos (MP4, WebM) up to 50MB
            </p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Media Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaFiles.map((media, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-4">
                    {/* Media Preview */}
                    <div className="aspect-video mb-3 bg-gray-100 rounded-lg overflow-hidden relative group">
                      {media.type === 'image' ? (
                        <img 
                          src={media.preview} 
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video 
                            src={media.preview}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-2">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      {/* Media Type Badge */}
                      <Badge 
                        className="absolute top-2 left-2"
                        variant={media.type === 'video' ? 'default' : 'secondary'}
                      >
                        {media.type === 'video' ? (
                          <Video className="h-3 w-3 mr-1" />
                        ) : (
                          <ImageIcon className="h-3 w-3 mr-1" />
                        )}
                        {media.type}
                      </Badge>
                    </div>

                    {/* Media Info */}
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={media.title}
                          onChange={(e) => updateMediaInfo(index, 'title', e.target.value)}
                          placeholder="Enter media title"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={media.description}
                          onChange={(e) => updateMediaInfo(index, 'description', e.target.value)}
                          placeholder="Describe this media"
                          className="h-16 resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upload Button */}
            <div className="flex justify-end">
              <Button 
                onClick={uploadMedia}
                disabled={uploading || mediaFiles.length === 0}
                className="bg-gradient-rainbow hover:opacity-90"
              >
                {uploading ? "Uploading..." : `Upload ${mediaFiles.length} file${mediaFiles.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderMediaUpload;
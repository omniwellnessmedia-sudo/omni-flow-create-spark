import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StorageImage {
  name: string;
  url: string;
  folder: string;
  id: string;
}

interface UseStorageImagesOptions {
  bucket?: string;
  folders?: string[];
  cacheTime?: number;
}

const CACHE_KEY_PREFIX = 'storage_images_';
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const useStorageImages = (options: UseStorageImagesOptions = {}) => {
  const {
    bucket = 'provider-images',
    folders = ['General Images'],
    cacheTime = DEFAULT_CACHE_TIME,
  } = options;

  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const cacheKey = `${CACHE_KEY_PREFIX}${bucket}_${folders.join('_')}`;
      
      // Check cache first
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < cacheTime) {
            setImages(data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Cache read error:', e);
      }

      // Fetch from Supabase
      setLoading(true);
      setError(null);
      
      try {
        const allImages: StorageImage[] = [];

        for (const folder of folders) {
          const { data: files, error: listError } = await supabase
            .storage
            .from(bucket)
            .list(folder, {
              limit: 100,
              sortBy: { column: 'name', order: 'asc' },
            });

          if (listError) {
            console.error(`Error listing ${folder}:`, listError);
            continue;
          }

          if (files) {
            const folderImages = files
              .filter(file => {
                const ext = file.name.toLowerCase();
                return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || 
                       ext.endsWith('.png') || ext.endsWith('.webp') || 
                       ext.endsWith('.gif');
              })
              .map(file => {
                const { data: urlData } = supabase
                  .storage
                  .from(bucket)
                  .getPublicUrl(`${folder}/${file.name}`);

                return {
                  name: file.name,
                  url: urlData.publicUrl,
                  folder,
                  id: `${folder}/${file.name}`,
                };
              });

            allImages.push(...folderImages);
          }
        }

        setImages(allImages);

        // Cache the results
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: allImages,
              timestamp: Date.now(),
            })
          );
        } catch (e) {
          console.warn('Cache write error:', e);
        }
      } catch (err) {
        console.error('Error fetching storage images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [bucket, folders.join(','), cacheTime]);

  const refreshImages = () => {
    const cacheKey = `${CACHE_KEY_PREFIX}${bucket}_${folders.join('_')}`;
    localStorage.removeItem(cacheKey);
    setLoading(true);
  };

  return { images, loading, error, refreshImages };
};

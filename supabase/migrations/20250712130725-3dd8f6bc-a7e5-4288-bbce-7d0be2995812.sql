-- Add foreign key relationships between blog tables and profiles
ALTER TABLE public.blog_posts 
ADD CONSTRAINT blog_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.blog_comments 
ADD CONSTRAINT blog_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
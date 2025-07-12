-- Create blog posts table for community publishing
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  read_time_minutes INTEGER DEFAULT 5,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  slug TEXT NOT NULL UNIQUE,
  seo_meta_title TEXT,
  seo_meta_description TEXT,
  social_shares JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog likes table
CREATE TABLE public.blog_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT blog_likes_check CHECK (
    (blog_post_id IS NOT NULL AND comment_id IS NULL) OR 
    (blog_post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(blog_post_id, user_id),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Users can view their own blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view comments on published posts" 
ON public.blog_comments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM blog_posts 
    WHERE blog_posts.id = blog_comments.blog_post_id 
    AND blog_posts.status = 'published'
  )
);

CREATE POLICY "Authenticated users can create comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.blog_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.blog_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for blog_likes
CREATE POLICY "Anyone can view likes on published content" 
ON public.blog_likes 
FOR SELECT 
USING (
  (blog_post_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM blog_posts 
    WHERE blog_posts.id = blog_likes.blog_post_id 
    AND blog_posts.status = 'published'
  )) OR
  (comment_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM blog_comments 
    JOIN blog_posts ON blog_posts.id = blog_comments.blog_post_id
    WHERE blog_comments.id = blog_likes.comment_id 
    AND blog_posts.status = 'published'
  ))
);

CREATE POLICY "Authenticated users can manage their own likes" 
ON public.blog_likes 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_comments_post_id ON blog_comments(blog_post_id);
CREATE INDEX idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX idx_blog_likes_post_id ON blog_likes(blog_post_id);
CREATE INDEX idx_blog_likes_comment_id ON blog_likes(comment_id);

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update post counts
CREATE OR REPLACE FUNCTION update_blog_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'blog_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE blog_posts 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.blog_post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE blog_posts 
      SET comments_count = comments_count - 1 
      WHERE id = OLD.blog_post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'blog_likes' THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.blog_post_id IS NOT NULL THEN
        UPDATE blog_posts 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.blog_post_id;
      ELSIF NEW.comment_id IS NOT NULL THEN
        UPDATE blog_comments 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.comment_id;
      END IF;
    ELSIF TG_OP = 'DELETE' THEN
      IF OLD.blog_post_id IS NOT NULL THEN
        UPDATE blog_posts 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.blog_post_id;
      ELSIF OLD.comment_id IS NOT NULL THEN
        UPDATE blog_comments 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.comment_id;
      END IF;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for count updates
CREATE TRIGGER update_blog_comments_count
AFTER INSERT OR DELETE ON blog_comments
FOR EACH ROW EXECUTE FUNCTION update_blog_post_counts();

CREATE TRIGGER update_blog_likes_count
AFTER INSERT OR DELETE ON blog_likes
FOR EACH ROW EXECUTE FUNCTION update_blog_post_counts();
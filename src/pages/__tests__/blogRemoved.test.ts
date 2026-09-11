import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The blog is removed. This pins that.
 *
 * It was removed because nobody was using it and the editor was unusable on
 * a phone, which is where the person expected to write posts actually works.
 * The risk after a removal like this is not that it comes back on purpose.
 * It is that a link to it survives somewhere nobody looked, and a visitor
 * lands on a dead page months later.
 *
 * So this checks three separate things: the files are gone, no route renders
 * a blog page, and nothing in the app links to a blog URL. The redirects
 * themselves are deliberate and allowed, because URLs outlive pages.
 */

const root = join(__dirname, '..', '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

const DELETED = [
  'src/pages/Blog.tsx',
  'src/pages/BlogPost.tsx',
  'src/pages/BlogEditor.tsx',
  'src/pages/CommunityBlog.tsx',
  'src/components/blog/RichTextEditor.tsx',
  'src/lib/renderPost.ts',
  'src/lib/textFromHtml.ts',
];

describe('the blog is gone', () => {
  it.each(DELETED)('%s no longer exists', (path) => {
    expect(existsSync(join(root, path))).toBe(false);
  });

  it('every blog and community URL redirects rather than rendering a page', () => {
    const app = read('src/App.tsx');

    // Each old URL must still be routed, so it redirects instead of 404ing.
    const oldUrls = [
      '/blog',
      '/blog-editor',
      '/blog/editor/new',
      '/blog/editor/:postId',
      '/blog/post/:slug',
      '/blog/community',
      '/blog-post/:slug',
      '/blog/:slug',
      '/community',
      '/community-blog',
      '/wellness-community',
    ];
    for (const url of oldUrls) {
      const route = new RegExp(
        `<Route path="${url.replace(/[/:]/g, (c) => '\\' + c)}" element=\\{<Navigate to="/" replace />\\} />`
      );
      expect(app, `${url} should redirect home`).toMatch(route);
    }

    // And no blog component may be mounted anywhere.
    expect(app).not.toMatch(/<(CommunityBlog|BlogEditor|BlogPost|Blog)\s*\/>/);
  });

  it('nothing in the app navigates to a blog URL', () => {
    // Redirect declarations in App.tsx are the one legitimate mention, so
    // App.tsx is checked by the test above instead of this one.
    const files = [
      'src/components/navigation/UnifiedNavigation.tsx',
      'src/components/navigation/MegaNavigation.tsx',
      'src/components/MegaNavigation.tsx',
      'src/components/dashboard/AdminHome.tsx',
      'src/components/dashboard/AdminLayout.tsx',
      'src/pages/AdminDashboard.tsx',
      'src/pages/ProviderDashboard.tsx',
      'src/pages/WellnessAccount.tsx',
      'src/pages/UpgradePage.tsx',
      'src/pages/admin/AdminContent.tsx',
    ];

    for (const file of files) {
      // Strip comments first: this file's own explanation of what was removed
      // says the word blog, and a comment cannot navigate anywhere.
      const code = read(file)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
        .replace(/^\s*\/\/.*$/gm, '');

      expect(code, `${file} still links to a blog URL`).not.toMatch(/["'`]\/blog/);
      expect(code, `${file} still links to the community blog`).not.toMatch(/["'`]\/community(-blog)?["'`]/);
    }
  });

  it('the sitemap does not advertise pages that no longer exist', () => {
    const sitemap = read('public/sitemap.xml');
    expect(sitemap).not.toMatch(/<loc>[^<]*\/blog<\/loc>/);
    expect(sitemap).not.toMatch(/<loc>[^<]*\/community<\/loc>/);
  });

  it('no page still offers a blog to a signed in user', () => {
    // UpgradePage sold "Community blog" as a plan feature. Selling a feature
    // that does not exist is the part of a removal that gets people in
    // trouble, so it gets its own check.
    expect(read('src/pages/UpgradePage.tsx')).not.toMatch(/Community blog/i);
    expect(read('src/pages/WellnessAccount.tsx')).not.toMatch(/Read Blog/i);
  });

  it('the media uploader survived the removal', () => {
    // It was buried inside the blog admin screen. Losing it by accident is
    // the realistic failure mode of deleting that screen, and video upload
    // is the thing that replaced the blog.
    expect(existsSync(join(root, 'src/components/media/MediaUploadDialog.tsx'))).toBe(true);
    const content = read('src/pages/admin/AdminContent.tsx');
    expect(content).toMatch(/MediaUploadDialog/);
    expect(content).toMatch(/Upload video/);
  });
});

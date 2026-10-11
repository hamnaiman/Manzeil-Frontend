// Custom uploaded covers stay authoritative; these are the starter campaigns.
export function blogBanner(post){
 const banners={
  '/images/posts/obsession.png':'/images/blog/signature-banner.png',
  '/images/posts/serene.png':'/images/blog/serene-banner.png',
  '/images/posts/business-elegance.png':'/images/blog/business-elegance-banner.png',
 };
 return banners[post?.cover?.url] || null;
}

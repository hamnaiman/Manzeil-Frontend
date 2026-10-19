# Storefront media and styling

Images in public/images have Cloudinary originals mapped in src/data/cloudinary-assets.json. StoreImage and MotionStoreImage resolve legacy local paths and deliver automatic format/quality with responsive widths. Unknown/custom URLs stay authoritative. API keys remain in the backend environment; the browser manifest contains only public image URLs.

MongoDB stores content, products, orders, reviews and media URLs. The media migration only fills missing/default local slots; existing custom uploads remain unchanged. The previous media map is backed up in backend/seed/media-before-cloudinary.json. Local originals are retained for recovery.

Admin uploads use the existing authenticated Cloudinary flow. The upload size limit stays 5 MB; image dimensions now limit to 2400 px instead of 1000 px to retain banner detail. Restart the backend to apply this setting.

Tailwind is configured already. Shared card and preview rules use Tailwind utilities in product-campaign.css. Its original import order is retained to preserve the previous mobile card appearance. Storefront colour tokens are available under storefront in tailwind.config.js. Other existing styling remains for incremental migration without changing the current layout.

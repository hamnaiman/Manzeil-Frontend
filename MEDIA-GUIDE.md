# Storefront editing guide

The original warm ivory / charcoal palette is used throughout the storefront.

Hero: src/components/Hero.jsx is intentionally a blank reserved section.
Replace that component with your own design. Its spacing is controlled by
.hero-reserved in src/index.css.

Videos: edit src/data/scentFilms.js.
Put files in public/videos and set src to "/videos/your-film.mp4".
Optionally set poster to a local cover image path.
An empty src displays an editorial placeholder, never a broken player.
The films do not autoplay.

The two collection banners use sample Unsplash photos. Replace the image URLs
in src/pages/Home.jsx with your own brand assets.

Products and prices still come from the existing API.
Search, categories, price sorting, product details and adding to bag use live data.

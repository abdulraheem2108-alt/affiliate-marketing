# Beauty finds hub - Affiliate Marketing Website

A modern, fast, and beautiful affiliate marketing website for ladies' products with Pinterest-friendly URLs and optimized design.

## Features

- ✅ Product listing page with grid/list view toggle
- ✅ Category filtering
- ✅ Sort by price, name, and rating
- ✅ Product detail pages with clean URLs
- ✅ Related products section
- ✅ Mobile-first responsive design
- ✅ Pinterest-optimized meta tags
- ✅ Lazy loading images for performance
- ✅ Beautiful girly color scheme
- ✅ Bootstrap 5 for responsive layout

## Project Structure

```
/
├── index.html              # Product listing page
├── product.html            # Product detail page
├── data/
│   └── products.json      # Product data (JSON database)
├── css/
│   ├── color-system.css   # Centralized color system
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js           # Listing page functionality
│   └── product.js        # Detail page functionality
├── images/
│   └── products/         # Product images (add your images here)
└── README.md
```

## Setup Instructions

### 1. Add Product Images

Place your product images in the `images/products/` folder. Use descriptive filenames matching the product IDs in `products.json`.

**Image Recommendations:**
- Format: JPG or PNG
- Size: Optimize images before uploading (recommended: 800x800px for thumbnails, 1200x1200px for detail pages)
- Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to compress images
- Naming: Use the same name as the product `id` in JSON (e.g., `elegant-rose-gold-necklace.jpg`)

### 2. Update Products JSON

Edit `data/products.json` to add your products:

```json
{
  "id": "unique-product-slug",
  "title": "Product Name",
  "description": "Full description",
  "shortDescription": "Short description for cards",
  "image": "images/products/product-slug.jpg",
  "price": 29.99,
  "originalPrice": 49.99,
  "affiliateLink": "your-amazon-affiliate-link",
  "category": "jewelry",
  "tags": ["tag1", "tag2"],
  "rating": 4.5,
  "reviews": 234
}
```

**Categories available:**
- `jewelry`
- `fashion`
- `beauty`
- `accessories`
- `home`

### 3. Update Affiliate Links

Replace the placeholder affiliate links in `products.json` with your actual Amazon affiliate links.

### 4. Customize Colors (Optional)

All colors are controlled in `css/color-system.css`. Modify the CSS variables to change the entire color scheme:

```css
:root {
  --primary-pink: #FFB6C1;
  --primary-rose: #FF69B4;
  /* ... more colors */
}
```

### 5. Deploy to Netlify

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Netlify will automatically deploy your site
4. Your site will be live at `your-site.netlify.app`

**Netlify Settings:**
- Build command: (leave empty - static site)
- Publish directory: `/` (root)

## URL Structure

- Home/Listing: `/index.html` or `/`
- Product Detail: `/product.html?id=product-slug`

Example: `your-site.netlify.app/product.html?id=elegant-rose-gold-necklace`

## Pinterest Optimization

The site includes:
- Open Graph meta tags for rich pins
- Pinterest-specific meta tags
- Clean, readable URLs
- Optimized image paths

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- Lazy loading images
- Optimized CSS and JavaScript
- Bootstrap CDN (cached)
- Minimal JavaScript footprint
- Mobile-first design

## Future Enhancements

- Admin dashboard for product management
- Search functionality
- Product reviews section
- Wishlist feature
- Image optimization service integration

## License

This project is for affiliate marketing purposes.

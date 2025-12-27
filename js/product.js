// JavaScript for Product Detail Page

let products = [];
let currentProduct = null;

// Load products and display current product
async function loadProduct() {
    try {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            document.getElementById('productDetail').innerHTML = 
                '<div class="col-12"><p class="text-center text-danger">Product not found.</p></div>';
            return;
        }
        
        // Load products JSON
        const response = await fetch('data/products.json');
        const data = await response.json();
        products = data.products;
        
        // Find current product
        currentProduct = products.find(p => p.id === productId);
        
        if (!currentProduct) {
            document.getElementById('productDetail').innerHTML = 
                '<div class="col-12"><p class="text-center text-danger">Product not found.</p></div>';
            return;
        }
        
        // Display product details
        displayProductDetails();
        
        // Load related products
        loadRelatedProducts();
        
        // Update meta tags for Pinterest
        updateMetaTags();
        
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('productDetail').innerHTML = 
            '<div class="col-12"><p class="text-center text-danger">Error loading product. Please try again later.</p></div>';
    }
}

// Display product details
function displayProductDetails() {
    const product = currentProduct;
    
    // Update page title
    document.title = `${product.title} - Beauty finds hub`;
    
    // Update product image
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.title;
    
    // Update product title
    document.getElementById('productTitle').textContent = product.title;
    
    // Update rating
    const stars = generateStars(product.rating);
    document.getElementById('productRating').innerHTML = 
        `${stars} <span style="margin-left: 0.5rem;">${product.rating} (${product.reviews} reviews)</span>`;
    
    // Update price
    document.getElementById('currentPrice').textContent = `$${product.price.toFixed(2)}`;
    if (product.originalPrice) {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        document.getElementById('originalPrice').textContent = `$${product.originalPrice.toFixed(2)}`;
        document.getElementById('originalPrice').style.display = 'inline';
        if (discount > 0) {
            const discountSpan = document.createElement('span');
            discountSpan.textContent = ` Save ${discount}%`;
            discountSpan.style.color = 'var(--success)';
            discountSpan.style.fontWeight = '600';
            discountSpan.style.marginLeft = '1rem';
            document.getElementById('productRating').parentElement.appendChild(discountSpan);
        }
    } else {
        document.getElementById('originalPrice').style.display = 'none';
    }
    
    // Update description
    document.getElementById('productDescription').textContent = product.description;
    
    // Update tags
    const tagsContainer = document.getElementById('productTags');
    tagsContainer.innerHTML = '';
    product.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // Update affiliate link
    document.getElementById('affiliateLink').href = product.affiliateLink;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star" style="color: var(--accent-gold);"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt" style="color: var(--accent-gold);"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star" style="color: var(--accent-gold);"></i>';
    }
    return starsHTML;
}

// Load related products (same category, different product)
function loadRelatedProducts() {
    if (!currentProduct) return;
    
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4); // Show max 4 related products
    
    const relatedContainer = document.getElementById('relatedProducts');
    
    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p class="text-center" style="color: var(--text-light);">No related products found.</p>';
        return;
    }
    
    relatedContainer.innerHTML = relatedProducts.map(product => createRelatedProductCard(product)).join('');
    
    // Lazy load images
    lazyLoadImages();
}

// Create related product card
function createRelatedProductCard(product) {
    const productUrl = `product.html?id=${product.id}`;
    const stars = generateStars(product.rating);
    
    return `
        <div class="product-card">
            <a href="${productUrl}">
                <img src="${product.image}" alt="${product.title}" class="product-card-image" loading="lazy">
            </a>
            <div class="product-card-body">
                <h3 class="product-card-title">
                    <a href="${productUrl}" style="color: inherit; text-decoration: none;">${product.title}</a>
                </h3>
                <p class="product-card-description">${product.shortDescription}</p>
                <div class="product-card-rating">
                    ${stars}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <div class="product-card-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <a href="${productUrl}" class="product-card-link">View Details</a>
            </div>
        </div>
    `;
}

// Update meta tags for Pinterest and SEO
function updateMetaTags() {
    if (!currentProduct) return;
    
    // Update description meta tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = currentProduct.shortDescription;
    
    // Add Open Graph tags for Pinterest
    const ogTags = {
        'og:title': currentProduct.title,
        'og:description': currentProduct.shortDescription,
        'og:image': new URL(currentProduct.image, window.location.origin).href,
        'og:url': window.location.href,
        'og:type': 'product'
    };
    
    Object.entries(ogTags).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    });
    
    // Add Pinterest specific tags
    const pinterestTags = {
        'pinterest:description': currentProduct.shortDescription,
        'pinterest:image': new URL(currentProduct.image, window.location.origin).href
    };
    
    Object.entries(pinterestTags).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    });
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProduct();
});


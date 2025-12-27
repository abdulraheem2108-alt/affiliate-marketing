// Main JavaScript for Product Listing Page

let products = [];
let filteredProducts = [];
let currentView = 'grid'; // 'grid' or 'list'
let currentCategory = 'all';
let currentSort = 'default';

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        products = data.products;
        filteredProducts = [...products];
        
        // Populate categories
        populateCategories(data.categories);
        
        // Display products
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<div class="col-12"><p class="text-center text-danger">Error loading products. Please try again later.</p></div>';
    }
}

// Populate category filter
function populateCategories(categories) {
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        if (category !== 'all') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        }
    });
}

// Display products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = currentView === 'grid' ? 'grid' : 'flex';
    productsGrid.className = currentView === 'grid' ? 'product-grid' : 'product-list';
    noProducts.style.display = 'none';
    
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Lazy load images
    lazyLoadImages();
}

// Create product card HTML
function createProductCard(product) {
    const discount = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    const stars = generateStars(product.rating);
    const productUrl = `product.html?id=${product.id}`;
    
    if (currentView === 'grid') {
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
                        ${discount > 0 ? `<span style="color: var(--success); font-weight: 600;">-${discount}%</span>` : ''}
                    </div>
                    <a href="${productUrl}" class="product-card-link">View Details</a>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="product-card product-card-list">
                <a href="${productUrl}">
                    <img src="${product.image}" alt="${product.title}" class="product-card-image" loading="lazy">
                </a>
                <div class="product-card-body">
                    <div>
                        <h3 class="product-card-title">
                            <a href="${productUrl}" style="color: inherit; text-decoration: none;">${product.title}</a>
                        </h3>
                        <p class="product-card-description">${product.description}</p>
                        <div class="product-card-rating">
                            ${stars}
                            <span>(${product.reviews} reviews)</span>
                        </div>
                    </div>
                    <div>
                        <div class="product-card-price">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            ${discount > 0 ? `<span style="color: var(--success); font-weight: 600;">-${discount}%</span>` : ''}
                        </div>
                        <a href="${productUrl}" class="product-card-link">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }
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

// Filter products by category
function filterByCategory(category) {
    currentCategory = category;
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    sortProducts();
    displayProducts();
}

// Sort products
function sortProducts() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Keep original order
            break;
    }
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        filterByCategory(e.target.value);
    });
    
    // Sort filter
    document.getElementById('sortFilter').addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortProducts();
        displayProducts();
    });
    
    // View toggle
    document.getElementById('gridViewBtn').addEventListener('click', () => {
        currentView = 'grid';
        document.getElementById('gridViewBtn').classList.add('active');
        document.getElementById('listViewBtn').classList.remove('active');
        displayProducts();
    });
    
    document.getElementById('listViewBtn').addEventListener('click', () => {
        currentView = 'list';
        document.getElementById('listViewBtn').classList.add('active');
        document.getElementById('gridViewBtn').classList.remove('active');
        displayProducts();
    });
});


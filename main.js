
// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const header = document.querySelector('.header');
const body = document.body;

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
  // Theme initialization
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Mobile menu setup
  if (mobileMenuToggle) {
    setupMobileMenu();
  }

  // Theme toggle setup
  if (themeToggle) {
    setupThemeToggle();
  }

  // Header scroll behavior
  if (header) {
    setupHeaderScroll();
  }

  // Initialize any page-specific functionality
  initPageSpecific();
});

// Mobile Menu Functionality
function setupMobileMenu() {
  // Create mobile nav if it doesn't exist
  if (!document.querySelector('.mobile-nav')) {
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // Clone main nav links
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
      mobileNav.innerHTML = mainNav.innerHTML;
      document.body.appendChild(mobileNav);
    }
  }

  const mobileNav = document.querySelector('.mobile-nav');
  
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if (mobileNav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu when clicking on links
  const mobileNavLinks = mobileNav.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Theme Toggle Functionality
function setupThemeToggle() {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    
    // Save preference to localStorage
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

// Header Scroll Behavior
function setupHeaderScroll() {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add shadow when scrolled
    if (currentScrollY > 10) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
  });
}

// Initialize page-specific JavaScript
function initPageSpecific() {
  // Get current page path
  const path = window.location.pathname;
  
  // Category page
  if (path.includes('category.html')) {
    initCategoryPage();
  }
  
  // Article page
  if (path.includes('article.html')) {
    initArticlePage();
  }
  
  // Table of contents page
  if (path.includes('table-of-contents.html')) {
    // Any specific TOC page functionality
  }
}

// Category Page
function initCategoryPage() {
  // Get category from URL
  const urlParams = new URLSearchParams(window.location.search);
  const categorySlug = urlParams.get('slug');
  
  if (categorySlug) {
    // Update page title
    const categoryTitle = document.querySelector('.category-title');
    if (categoryTitle) {
      categoryTitle.textContent = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    }
    
    // Set active filter
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
      if (filter.dataset.category === categorySlug) {
        filter.classList.add('active');
      } else {
        filter.classList.remove('active');
      }
      
      // Add click handler for filters
      filter.addEventListener('click', () => {
        const category = filter.dataset.category;
        window.location.href = `category.html?slug=${category}`;
      });
    });
  }
}

// Article Page
function initArticlePage() {
  // Get article slug from URL
  const urlParams = new URLSearchParams(window.location.search);
  const articleSlug = urlParams.get('slug');
  
  // Setup share buttons
  const shareButtons = document.querySelectorAll('.share-button');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const platform = button.dataset.platform;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      
      let shareUrl = '';
      
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(window.location.href)
            .then(() => {
              // Show toast notification
              showToast('Link copied to clipboard!');
            })
            .catch(err => {
              console.error('Failed to copy: ', err);
            });
          return;
      }
      
      // Open share dialog
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });
}

// Toast notification
function showToast(message, duration = 3000) {
  // Create toast if it doesn't exist
  if (!document.querySelector('.toast')) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
    
    // Add styles
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '0.75rem 1.5rem';
    toast.style.backgroundColor = 'var(--foreground)';
    toast.style.color = 'var(--background)';
    toast.style.borderRadius = 'var(--radius)';
    toast.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.zIndex = '9999';
  }
  
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.style.opacity = '1';
  
  // Hide after duration
  setTimeout(() => {
    toast.style.opacity = '0';
  }, duration);
}

// Create additional pages for the site

// Dynamically create table-of-contents.html
function createTableOfContentsPage() {
  const tocHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Table of Contents - Unfold Magazine</title>
    <meta name="description" content="UNFOLD - Table of Contents" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/main.css">
  </head>
  <body>
    <div id="app">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-inner">
            <a href="index.html" class="logo">UNFOLD</a>
            <nav class="main-nav">
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="category.html?slug=culture">Culture</a></li>
                <li><a href="category.html?slug=business">Business</a></li>
                <li><a href="category.html?slug=lifestyle">Lifestyle</a></li>
                <li><a href="category.html?slug=travel">Travel</a></li>
                <li><a href="table-of-contents.html">Contents</a></li>
              </ul>
            </nav>
            <button class="mobile-menu-toggle" aria-label="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <div class="toc-container container">
          <div class="toc-header">
            <h1 class="text-4xl md:text-6xl font-serif mb-16 tracking-tighter">
              TABLE OF CONTENTS
            </h1>
          </div>
          
          <div class="toc-grid">
            <div class="toc-item">
              <div class="toc-item-header">
                <span class="toc-item-number">05</span>
                <h2 class="toc-item-title">
                  <a href="article.html?slug=special-issue-nigeria-youth-entrepreneurship-revolution">
                    Special Issue: Nigeria's Youth Entrepreneurship Revolution
                  </a>
                </h2>
              </div>
            </div>
            
            <div class="toc-item">
              <div class="toc-item-header">
                <span class="toc-item-number">18</span>
                <h2 class="toc-item-title">
                  <a href="article.html?slug=unfold-afrobeat-playlist">
                    Unfold Afrobeat Playlist
                  </a>
                </h2>
              </div>
            </div>
            
            <div class="toc-item">
              <div class="toc-item-header">
                <span class="toc-item-number">11</span>
                <h2 class="toc-item-title">
                  <a href="article.html?slug=sheep-superior-human-elevating-everyone-potential">
                    S.H.E.E.P: Superior human elevating everyone's potential
                  </a>
                </h2>
              </div>
            </div>
            
            <div class="toc-item">
              <div class="toc-item-header">
                <span class="toc-item-number">18</span>
                <h2 class="toc-item-title">
                  <a href="article.html?slug=cruise-control-dream-destinations">
                    Cruise Control: Dream Destinations You Can't Miss
                  </a>
                </h2>
              </div>
            </div>
            
            <div class="toc-item">
              <div class="toc-item-header">
                <span class="toc-item-number">14</span>
                <h2 class="toc-item-title">
                  <a href="article.html?slug=afrobeats-to-the-world">
                    Afrobeats to the World: The Evolution of Nigerian Music
                  </a>
                </h2>
              </div>
            </div>
            
            <div class="toc-item">
              <div class="toc-item-header">
                <span class="toc-item-number">22</span>
                <h2 class="toc-item-title">
                  <a href="article.html?slug=faces-of-the-future-young-nigerians">
                    Faces of the Future: Young Nigerians Leading the Wave
                  </a>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-logo">UNFOLD</div>
            <p class="footer-tagline">A bold new space where stories rise, style speaks, and every page drips with purpose and pulse.</p>
          </div>
          <div class="footer-middle">
            <div class="footer-nav">
              <h3>Categories</h3>
              <ul>
                <li><a href="category.html?slug=culture">Culture</a></li>
                <li><a href="category.html?slug=business">Business</a></li>
                <li><a href="category.html?slug=lifestyle">Lifestyle</a></li>
                <li><a href="category.html?slug=travel">Travel</a></li>
              </ul>
            </div>
            <div class="footer-nav">
              <h3>Pages</h3>
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="table-of-contents.html">Table of Contents</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div class="footer-nav">
              <h3>Subscribe</h3>
              <form class="subscribe-form">
                <input type="email" placeholder="Your email" required>
                <button type="submit" class="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2023 UNFOLD Magazine. All rights reserved.</p>
            <div class="social-links">
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <!-- Floating Buttons -->
      <div class="floating-buttons">
        <button class="theme-toggle" aria-label="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Scripts -->
    <script src="main.js"></script>
  </body>
</html>
  `;
  
  // Create the file
  const tocBlob = new Blob([tocHTML], { type: 'text/html' });
  const tocUrl = URL.createObjectURL(tocBlob);
  
  // Create download link
  const tocLink = document.createElement('a');
  tocLink.href = tocUrl;
  tocLink.download = 'table-of-contents.html';
  
  // Trigger download
  tocLink.click();
  
  // Clean up
  URL.revokeObjectURL(tocUrl);
}

// Template for article page
function createArticlePageTemplate() {
  const articleHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Article Title - Unfold Magazine</title>
    <meta name="description" content="Article description" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/main.css">
  </head>
  <body>
    <div id="app">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-inner">
            <a href="index.html" class="logo">UNFOLD</a>
            <nav class="main-nav">
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="category.html?slug=culture">Culture</a></li>
                <li><a href="category.html?slug=business">Business</a></li>
                <li><a href="category.html?slug=lifestyle">Lifestyle</a></li>
                <li><a href="category.html?slug=travel">Travel</a></li>
                <li><a href="table-of-contents.html">Contents</a></li>
              </ul>
            </nav>
            <button class="mobile-menu-toggle" aria-label="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <article class="article-container container">
          <header class="article-header">
            <a href="category.html?slug=CATEGORY" class="category-link">CATEGORY</a>
            <h1 class="article-title">ARTICLE TITLE</h1>
            <div class="article-meta-large">
              <span>By AUTHOR</span>
              <span class="mx-2">•</span>
              <time>DATE</time>
            </div>
          </header>
          
          <div class="article-featured-image">
            <img src="IMAGE_URL" alt="ARTICLE TITLE">
          </div>
          
          <div class="article-content">
            <!-- Article content goes here -->
            <p>Article content paragraph 1</p>
            <h2>Section title</h2>
            <p>Article content paragraph 2</p>
            <!-- More content -->
          </div>
          
          <footer class="article-footer">
            <div class="share-buttons">
              <button class="share-button" data-platform="twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span>Twitter</span>
              </button>
              
              <button class="share-button" data-platform="facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span>Facebook</span>
              </button>
              
              <button class="share-button" data-platform="linkedin">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span>LinkedIn</span>
              </button>
              
              <button class="share-button" data-platform="copy">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Copy Link</span>
              </button>
            </div>
          </footer>
        </article>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-logo">UNFOLD</div>
            <p class="footer-tagline">A bold new space where stories rise, style speaks, and every page drips with purpose and pulse.</p>
          </div>
          <div class="footer-middle">
            <div class="footer-nav">
              <h3>Categories</h3>
              <ul>
                <li><a href="category.html?slug=culture">Culture</a></li>
                <li><a href="category.html?slug=business">Business</a></li>
                <li><a href="category.html?slug=lifestyle">Lifestyle</a></li>
                <li><a href="category.html?slug=travel">Travel</a></li>
              </ul>
            </div>
            <div class="footer-nav">
              <h3>Pages</h3>
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="table-of-contents.html">Table of Contents</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div class="footer-nav">
              <h3>Subscribe</h3>
              <form class="subscribe-form">
                <input type="email" placeholder="Your email" required>
                <button type="submit" class="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2023 UNFOLD Magazine. All rights reserved.</p>
            <div class="social-links">
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <!-- Floating Buttons -->
      <div class="floating-buttons">
        <a href="table-of-contents.html" class="toc-button" aria-label="Table of Contents">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="16" y2="18"></line>
          </svg>
        </a>
        <button class="theme-toggle" aria-label="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Scripts -->
    <script src="main.js"></script>
  </body>
</html>
  `;
  
  // This would be used as a template for generating article pages
  return articleHTML;
}

// Template for category page
function createCategoryPageTemplate() {
  const categoryHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Category - Unfold Magazine</title>
    <meta name="description" content="Browse articles in this category" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/main.css">
  </head>
  <body>
    <div id="app">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-inner">
            <a href="index.html" class="logo">UNFOLD</a>
            <nav class="main-nav">
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="category.html?slug=culture">Culture</a></li>
                <li><a href="category.html?slug=business">Business</a></li>
                <li><a href="category.html?slug=lifestyle">Lifestyle</a></li>
                <li><a href="category.html?slug=travel">Travel</a></li>
                <li><a href="table-of-contents.html">Contents</a></li>
              </ul>
            </nav>
            <button class="mobile-menu-toggle" aria-label="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <div class="category-container container">
          <header class="category-header">
            <h1 class="category-title">Category Name</h1>
            
            <div class="category-filters">
              <button class="category-filter active" data-category="culture">
                Culture
                <span class="count">(5)</span>
              </button>
              <button class="category-filter" data-category="business">
                Business
                <span class="count">(3)</span>
              </button>
              <button class="category-filter" data-category="lifestyle">
                Lifestyle
                <span class="count">(4)</span>
              </button>
              <button class="category-filter" data-category="travel">
                Travel
                <span class="count">(6)</span>
              </button>
            </div>
            
            <div class="category-divider"></div>
          </header>

          <div class="article-grid">
            <!-- Article cards will be populated based on the selected category -->
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-logo">UNFOLD</div>
            <p class="footer-tagline">A bold new space where stories rise, style speaks, and every page drips with purpose and pulse.</p>
          </div>
          <div class="footer-middle">
            <div class="footer-nav">
              <h3>Categories</h3>
              <ul>
                <li><a href="category.html?slug=culture">Culture</a></li>
                <li><a href="category.html?slug=business">Business</a></li>
                <li><a href="category.html?slug=lifestyle">Lifestyle</a></li>
                <li><a href="category.html?slug=travel">Travel</a></li>
              </ul>
            </div>
            <div class="footer-nav">
              <h3>Pages</h3>
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="table-of-contents.html">Table of Contents</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div class="footer-nav">
              <h3>Subscribe</h3>
              <form class="subscribe-form">
                <input type="email" placeholder="Your email" required>
                <button type="submit" class="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2023 UNFOLD Magazine. All rights reserved.</p>
            <div class="social-links">
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <!-- Floating Buttons -->
      <div class="floating-buttons">
        <a href="table-of-contents.html" class="toc-button" aria-label="Table of Contents">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="16" y2="18"></line>
          </svg>
        </a>
        <button class="theme-toggle" aria-label="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Scripts -->
    <script src="main.js"></script>
  </body>
</html>
  `;
  
  // This would be used as a template for creating category pages
  return categoryHTML;
}

// Helper functions for static site generation
// In a real implementation, these templates would be used to generate actual HTML files

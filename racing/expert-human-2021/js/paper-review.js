/**
 * Paper Reviews - Paper Review Page JavaScript
 * 
 * Handles functionality for the paper review page:
 * - Table of contents highlighting
 * - Share functionality
 * - Mobile navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const shareBtn = document.querySelector('.share-btn');
    const tocLinks = document.querySelectorAll('.toc-link');
    const reviewSections = document.querySelectorAll('.review-card[id]');
    
    // Initialize
    function init() {
        // Set up share button
        if (shareBtn) {
            shareBtn.addEventListener('click', handleShare);
        }
        
        // Set up TOC link clicks
        tocLinks.forEach(link => {
            link.addEventListener('click', handleTocLinkClick);
        });
        
        // Set up scroll spy
        window.addEventListener('scroll', debounce(handleScroll, 100));
    }
    
    /**
     * Handle sharing the review
     */
    function handleShare() {
        // Get page info
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: pageTitle,
                url: pageUrl
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(pageUrl).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy link: ', err);
            });
        }
    }
    
    /**
     * Handle TOC link click
     * @param {Event} e - Click event
     */
    function handleTocLinkClick(e) {
        e.preventDefault();
        
        // Get target section
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Calculate offset (accounting for fixed header)
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active TOC link
            updateActiveTocLink(targetId);
        }
    }
    
    /**
     * Handle scroll event for scroll spy
     */
    function handleScroll() {
        // Get current position
        const scrollPosition = window.scrollY;
        
        // Find the current section
        let currentSection = '';
        
        reviewSections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            
            if (scrollPosition >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            updateActiveTocLink(currentSection);
        }
    }
    
    /**
     * Update active TOC link
     * @param {string} sectionId - ID of the active section
     */
    function updateActiveTocLink(sectionId) {
        // Remove active class from all links
        tocLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        const activeLink = document.querySelector(`.toc-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    /**
     * Debounce function to limit event handler execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Milliseconds to wait
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize the page
    init();
});
/**
 * Paper Reviews - Main JavaScript
 * 
 * Handles interactive elements including:
 * - Header visibility
 * - Mobile navigation
 * - Smooth scrolling
 * - Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.querySelector('.header');
  const headerSensor = document.querySelector('.header-sensor');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // State variables
  let isHeaderVisible = false;
  let isMenuOpen = false;
  
  /**
   * Show/hide header functionality
   */
  function showHeader() {
    if (!isHeaderVisible) {
      header.classList.add('active');
      isHeaderVisible = true;
    }
  }
  
  function hideHeader() {
    if (isHeaderVisible && !isMenuOpen) {
      header.classList.remove('active');
      isHeaderVisible = false;
    }
  }
  
  // Header visibility sensor
  headerSensor.addEventListener('mouseenter', showHeader);
  
  // Show header on scroll up, hide on scroll down
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
      // Scrolling down
      hideHeader();
    } else {
      // Scrolling up
      showHeader();
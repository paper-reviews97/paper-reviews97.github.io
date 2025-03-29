/**
 * Paper Reviews - Paper List JavaScript
 * 
 * Handles functionality for the paper list page:
 * - Filtering papers
 * - Searching papers
 * - Pagination
 * - UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const paperSearch = document.getElementById('paper-search');
    const filterYear = document.getElementById('filter-year');
    const filterOrg = document.getElementById('filter-org');
    const filterTag = document.getElementById('filter-tag');
    const filterSort = document.getElementById('filter-sort');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const resultsCount = document.getElementById('results-count').querySelector('span');
    const activeFilters = document.getElementById('active-filters');
    const paperItems = document.querySelectorAll('.paper-list-item');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationPages = document.querySelectorAll('.pagination-page');
    
    // State
    let activeFiltersState = {
      search: '',
      year: 'all',
      org: 'all',
      tag: 'all',
      sort: 'recent'
    };
    
    /**
     * Initialize the paper list functionality
     */
    function init() {
      // Add event listeners
      paperSearch.addEventListener('input', handleSearchInput);
      filterYear.addEventListener('change', handleFilterChange);
      filterOrg.addEventListener('change', handleFilterChange);
      filterTag.addEventListener('change', handleFilterChange);
      filterSort.addEventListener('change', handleSortChange);
      clearFiltersBtn.addEventListener('click', clearAllFilters);
      
      // Set up pagination
      paginationBtns.forEach(btn => {
        btn.addEventListener('click', handlePagination);
      });
      
      paginationPages.forEach(page => {
        page.addEventListener('click', handlePageClick);
      });
      
      // Apply initial filters
      applyFilters();
    }
    
    /**
     * Handle search input
     */
    function handleSearchInput() {
      activeFiltersState.search = paperSearch.value.trim().toLowerCase();
      updateActiveFiltersUI();
      applyFilters();
    }
    
    /**
     * Handle filter change
     * @param {Event} event - The change event
     */
    function handleFilterChange(event) {
      const { id, value } = event.target;
      
      switch(id) {
        case 'filter-year':
          activeFiltersState.year = value;
          break;
        case 'filter-org':
          activeFiltersState.org = value;
          break;
        case 'filter-tag':
          activeFiltersState.tag = value;
          break;
      }
      
      updateActiveFiltersUI();
      applyFilters();
    }
    
    /**
     * Handle sort change
     */
    function handleSortChange() {
      activeFiltersState.sort = filterSort.value;
      applyFilters();
    }
    
    /**
     * Apply all filters to the paper list
     */
    function applyFilters() {
      let visibleCount = 0;
      
      // Loop through all paper items
      paperItems.forEach(item => {
        const itemYear = item.dataset.year;
        const itemOrg = item.dataset.org;
        const itemTags = item.dataset.tags ? item.dataset.tags.split(',') : [];
        const itemTitle = item.querySelector('.paper-list-title').textContent.toLowerCase();
        const itemAbstract = item.querySelector('.paper-list-abstract').textContent.toLowerCase();
        const itemAuthors = item.querySelector('.paper-list-authors').textContent.toLowerCase();
        
        let matchesSearch = true;
        let matchesYear = true;
        let matchesOrg = true;
        let matchesTag = true;
        
        // Check search
        if (activeFiltersState.search) {
          matchesSearch = 
            itemTitle.includes(activeFiltersState.search) || 
            itemAbstract.includes(activeFiltersState.search) || 
            itemAuthors.includes(activeFiltersState.search);
        }
        
        // Check year filter
        if (activeFiltersState.year !== 'all') {
          if (activeFiltersState.year === 'older') {
            matchesYear = parseInt(itemYear) < 2020;
          } else {
            matchesYear = itemYear === activeFiltersState.year;
          }
        }
        
        // Check organization filter
        if (activeFiltersState.org !== 'all') {
          matchesOrg = itemOrg === activeFiltersState.org;
        }
        
        // Check tag filter
        if (activeFiltersState.tag !== 'all') {
          matchesTag = itemTags.includes(activeFiltersState.tag);
        }
        
        // Show or hide based on filters
        const isVisible = matchesSearch && matchesYear && matchesOrg && matchesTag;
        item.style.display = isVisible ? 'block' : 'none';
        
        if (isVisible) {
          visibleCount++;
        }
      });
      
      // Update the results count
      resultsCount.textContent = visibleCount;
      
      // Apply sorting
      applySorting();
    }
    
    /**
     * Apply sorting to visible papers
     */
    function applySorting() {
      const paperList = document.querySelector('.paper-list');
      const visiblePapers = [...paperItems].filter(item => item.style.display !== 'none');
      
      // Sort papers based on selected sort option
      switch(activeFiltersState.sort) {
        case 'recent':
          visiblePapers.sort((a, b) => parseInt(b.dataset.year) - parseInt(a.dataset.year));
          break;
        case 'oldest':
          visiblePapers.sort((a, b) => parseInt(a.dataset.year) - parseInt(b.dataset.year));
          break;
        case 'cited':
          // This would require citation count data in the dataset
          // For now, we'll use a placeholder sorting
          visiblePapers.sort((a, b) => {
            const aCitations = a.querySelector('.paper-citation-count').textContent;
            const bCitations = b.querySelector('.paper-citation-count').textContent;
            return parseInt(bCitations) - parseInt(aCitations);
          });
          break;
        case 'influential':
          // This would require influence score data in the dataset
          // For now, we'll use a placeholder sorting based on citations * recency
          visiblePapers.sort((a, b) => {
            const aYear = parseInt(a.dataset.year);
            const bYear = parseInt(b.dataset.year);
            const aCitations = parseInt(a.querySelector('.paper-citation-count').textContent);
            const bCitations = parseInt(b.querySelector('.paper-citation-count').textContent);
            
            const aScore = aCitations * (aYear - 2000);
            const bScore = bCitations * (bYear - 2000);
            
            return bScore - aScore;
          });
          break;
      }
      
      // Reorder papers in the DOM
      visiblePapers.forEach(paper => {
        paperList.appendChild(paper);
      });
    }
    
    /**
     * Update the active filters UI
     */
    function updateActiveFiltersUI() {
      // Clear current active filters
      activeFilters.innerHTML = '';
      
      // Add search filter if active
      if (activeFiltersState.search) {
        addActiveFilterUI('Search', activeFiltersState.search, () => {
          activeFiltersState.search = '';
          paperSearch.value = '';
          updateActiveFiltersUI();
          applyFilters();
        });
      }
      
      // Add year filter if active
      if (activeFiltersState.year !== 'all') {
        const yearText = activeFiltersState.year === 'older' ? '2019 & Older' : activeFiltersState.year;
        addActiveFilterUI('Year', yearText, () => {
          activeFiltersState.year = 'all';
          filterYear.value = 'all';
          updateActiveFiltersUI();
          applyFilters();
        });
      }
      
      // Add organization filter if active
      if (activeFiltersState.org !== 'all') {
        addActiveFilterUI('Organization', activeFiltersState.org, () => {
          activeFiltersState.org = 'all';
          filterOrg.value = 'all';
          updateActiveFiltersUI();
          applyFilters();
        });
      }
      
      // Add tag filter if active
      if (activeFiltersState.tag !== 'all') {
        addActiveFilterUI('Topic', activeFiltersState.tag, () => {
          activeFiltersState.tag = 'all';
          filterTag.value = 'all';
          updateActiveFiltersUI();
          applyFilters();
        });
      }
    }
    
    /**
     * Add an active filter to the UI
     * @param {string} label - The filter label
     * @param {string} value - The filter value
     * @param {Function} removeCallback - Callback function when filter is removed
     */
    function addActiveFilterUI(label, value, removeCallback) {
      const filterElement = document.createElement('div');
      filterElement.className = 'active-filter';
      filterElement.innerHTML = `
        <span>${label}: ${value}</span>
        <button class="active-filter-remove" aria-label="Remove filter">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;
      
      // Add remove event listener
      const removeBtn = filterElement.querySelector('.active-filter-remove');
      removeBtn.addEventListener('click', removeCallback);
      
      // Append to active filters container
      activeFilters.appendChild(filterElement);
    }
    
    /**
     * Clear all filters
     */
    function clearAllFilters() {
      // Reset all filters
      activeFiltersState = {
        search: '',
        year: 'all',
        org: 'all',
        tag: 'all',
        sort: 'recent'
      };
      
      // Reset form elements
      paperSearch.value = '';
      filterYear.value = 'all';
      filterOrg.value = 'all';
      filterTag.value = 'all';
      filterSort.value = 'recent';
      
      // Update UI and apply filters
      updateActiveFiltersUI();
      applyFilters();
    }
    
    /**
     * Handle pagination button click
     */
    function handlePagination(event) {
      // This is a placeholder for actual pagination
      // In a real implementation, this would load the next/previous page of papers
      
      const isPrev = event.currentTarget.classList.contains('pagination-prev');
      
      // Get current active page
      const activePage = document.querySelector('.pagination-page.active');
      const activeIndex = Array.from(paginationPages).indexOf(activePage);
      
      // Calculate target page index
      let targetIndex;
      if (isPrev) {
        targetIndex = Math.max(0, activeIndex - 1);
      } else {
        targetIndex = Math.min(paginationPages.length - 1, activeIndex + 1);
      }
      
      // Update active page
      activePage.classList.remove('active');
      paginationPages[targetIndex].classList.add('active');
      
      // Disable/enable pagination buttons as needed
      paginationBtns[0].disabled = targetIndex === 0;
      paginationBtns[1].disabled = targetIndex === paginationPages.length - 1;
      
      // Scroll to top of paper list
      document.querySelector('.paper-list-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Handle pagination page click
     */
    function handlePageClick(event) {
      // This is a placeholder for actual pagination
      // In a real implementation, this would load the specific page of papers
      
      // Update active page
      document.querySelector('.pagination-page.active').classList.remove('active');
      event.currentTarget.classList.add('active');
      
      // Get current active page index
      const activeIndex = Array.from(paginationPages).indexOf(event.currentTarget);
      
      // Disable/enable pagination buttons as needed
      paginationBtns[0].disabled = activeIndex === 0;
      paginationBtns[1].disabled = activeIndex === paginationPages.length - 1;
      
      // Scroll to top of paper list
      document.querySelector('.paper-list-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Initialize
    init();
  });